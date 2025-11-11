from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io

app = FastAPI()

# Allow browser calls from local dev and deployed hosts; adjust as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/efficient-frontier")
async def efficient_frontier(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file.")

        # Try CSV first, then Excel
        returns_df = None
        filename_lower = (file.filename or "").lower()
        try:
            if filename_lower.endswith(".csv"):
                returns_df = pd.read_csv(io.BytesIO(content), index_col=0)
            else:
                # Excel (xlsx/xls)
                returns_df = pd.read_excel(io.BytesIO(content), index_col=0, engine="openpyxl")
        except Exception:
            # Attempt alternate read paths
            try:
                returns_df = pd.read_csv(io.BytesIO(content), index_col=0)
            except Exception:
                returns_df = pd.read_excel(io.BytesIO(content), index_col=0, engine="openpyxl")

        if returns_df is None or returns_df.empty:
            raise HTTPException(status_code=400, detail="Could not read returns data.")

        fund_names = returns_df.index.tolist()
        num_funds = len(fund_names)
        if num_funds == 0:
            raise HTTPException(status_code=400, detail="No funds found. Check file format.")

        # Hard-coded parameters as in the provided script
        LAMBDA_VAL = 0.0001
        RT_VAL = 0.0095223724959047

        returns_t = returns_df.transpose()
        returns_t = returns_t.apply(pd.to_numeric, errors="coerce")

        identity_matrix = pd.DataFrame(np.identity(num_funds), index=fund_names, columns=fund_names)

        mu = returns_t.mean()
        mu.name = "mu"
        Sigma_raw = returns_t.cov()

        Sigma_reg = Sigma_raw + (LAMBDA_VAL * identity_matrix)
        Sigma_inv = pd.DataFrame(np.linalg.inv(Sigma_reg.values), columns=Sigma_reg.columns, index=Sigma_reg.index)

        ones_vec = pd.Series(1.0, index=fund_names, name="ones")
        v1 = Sigma_inv.dot(ones_vec)
        v2 = Sigma_inv.dot(mu)

        A = ones_vec.dot(v1)
        B = ones_vec.dot(v2)
        C = mu.dot(v2)
        Den = (A * C) - (B ** 2)

        alpha = (C - B * RT_VAL) / Den
        beta = (A * RT_VAL - B) / Den
        w = (alpha * v1) + (beta * v2)
        w.name = "Calculated_Weights"

        weights = [{"fund": idx, "weight": float(val)} for idx, val in w.items()]
        return {"weights": weights}
    finally:
        # Ensure file is closed
        await file.close()


