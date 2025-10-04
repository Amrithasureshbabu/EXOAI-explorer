# EXOAI-explorer
ExoAI Explorer is a futuristic, space-themed web app that empowers users to discover distant worlds using real astronomical data and artificial intelligence. By combining Kepler/TESS light curve datasets with a custom-built AI detection model, our platform transforms raw starlight into planetary insights
# 🚀 ExoAI Explorer – Hunting Exoplanets with AI

**ExoAI Explorer** is an interactive web app that empowers users to discover exoplanets using real NASA light curve data and AI-powered analysis. Designed with a futuristic space-themed interface, it makes space science accessible, engaging, and fun.

## 🌌 Features

- **Star Map Navigation** – Explore stars across the galaxy with an interactive map.
- **AI-Powered Light Curve Analysis** – Detect potential exoplanets using Kepler/TESS data and custom ML models.
- **Auto-Generated Planet Profiles** – View estimated size, orbit, and habitability scores.
- **NASA Archive Comparison** – Cross-reference findings with NASA’s Exoplanet Archive.

## 🧠 How It Works

1. **Data Ingestion** – Light curve data from Kepler/TESS missions.
2. **AI Detection** – Custom-trained model identifies transit dips indicating possible exoplanets.
3. **Visualization** – Brightness curves and star maps rendered in-browser.
4. **Profile Generation** – Planet stats inferred from transit depth and duration.

## 🛠️ Tech Stack

| Layer         | Tools Used                          |
|--------------|--------------------------------------|
| Frontend     | HTML, CSS, JavaScript, D3.js         |
| Backend      | Python (Flask/FastAPI), NumPy, Pandas|
| AI Model     | TensorFlow / PyTorch                 |
| Data Sources | NASA Kepler/TESS, Exoplanet Archive  |

## 📦 Installation

```bash
git clone https://github.com/yourusername/exoai-explorer.git
cd exoai-explorer
pip install -r requirements.txt
npm install  # if frontend uses Node.js
