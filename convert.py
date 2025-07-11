from flask import Flask, jsonify
import pandas as pd
import os

app = Flask(__name__)

# === CONFIG ===
configs = [
    {"excel_file": "sofr.xlsx", "output_dir": "data/sofr"},
    {"excel_file": "sonia.xlsx", "output_dir": "data/sonia"},
    {"excel_file": "euribor.xlsx", "output_dir": "data/euribor"},
]

# === SHEETS (same for all) ===
sheets = [
    "Outright",
    "3M Spread",
    "6M Spread",
    "12M Spread",
    "3M Fly",
    "6M Fly",
    "12M Fly",
    "3M Double Fly",
    "6M Double Fly",
    "12M Double Fly"
]

@app.route("/convert", methods=["GET"])
def convert_files():
    logs = []

    for config in configs:
        excel_file = config["excel_file"]
        output_dir = config["output_dir"]

        os.makedirs(output_dir, exist_ok=True)

        logs.append(f"📂 Converting {excel_file} -> {output_dir}")

        for sheet in sheets:
            try:
                df = pd.read_excel(excel_file, sheet_name=sheet)
                output_file = f"{output_dir}/{sheet.replace(' ', '_').lower()}.json"
                df.to_json(output_file, orient="records")
                logs.append(f"✅ Converted: {sheet} -> {output_file}")
            except Exception as e:
                logs.append(f"❌ Error converting {sheet} in {excel_file}: {e}")

    logs.append("🎉 All done! Your JSON files are in their respective folders.")
    return jsonify({"logs": logs})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
