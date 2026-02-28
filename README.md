# Military Object Detection using YOLOv8s

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Model](https://img.shields.io/badge/Model-YOLOv8s-FF6F00)
![Training](https://img.shields.io/badge/Trained%20on-Google%20Colab-F9AB00?logo=googlecolab&logoColor=white)
![Deployment](https://img.shields.io/badge/Deployed%20on-HuggingFace%20Spaces-FFBF00?logo=huggingface&logoColor=black)
![mAP@50](https://img.shields.io/badge/mAP@50-0.478-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

A robust object detection system built using **YOLOv8s** to identify military assets from aerial and ground imagery.  
The model is optimized for both **accuracy and CPU-level deployment efficiency**.

---

## 🚀 Live Demo

🔗 Hugging Face Deployment:  
> *(Add your Hugging Face Spaces link here)*

---

## 📌 Project Overview

This project focuses on detecting military objects under challenging real-world conditions such as:

- Camouflage
- Small-scale distant objects
- Dense vegetation
- Cluttered backgrounds
- Variable lighting conditions

The system was trained, optimized, and deployed with a focus on:
- Performance
- Robustness
- Efficiency
- Deployment feasibility

---

## 🎯 Target Classes

- Military Soldiers
- Military Aircraft
- Military Warships
- Military Vehicles

---

## 🧠 Model Architecture

- **Base Model:** YOLOv8s
- **Backbone:** CSP-inspired architecture
- **Feature Aggregation:** PAN-FPN
- **Detection Head:** Decoupled classification + localization
- **Loss Components:** Box Loss + Class Loss + DFL Loss

YOLOv8s was selected for its optimal balance between speed and accuracy.

---

## 🏋️ Training Details

| Component | Value |
|-----------|--------|
| Epochs | 50 |
| Image Size | 640 × 640 |
| Optimizer | AdamW |
| GPU | T4 (Google Colab) |
| Resume Training | Yes |
| Confidence Threshold | 0.25–0.5 tuned |

### Training Strategy
- Dataset cleaning and label correction
- Removal of corrupt and empty annotations
- Train–validation rebalance
- Resume-based training for stability
- Confidence threshold tuning
- GPU memory optimization via batch tuning

---

## 📊 Performance Metrics

| Metric | Score |
|--------|--------|
| mAP@50 | **0.478** |
| Model Size | ~22 MB |
| CPU Inference | ~25–35 ms |
| GPU Inference | ~7–10 ms |

The model demonstrates strong generalization despite camouflage-heavy and small-object scenarios.

---

## 🔬 Robustness Evaluation

### ✔ Lighting Variations
Performs well under daylight, cloudy, and shaded environments.

### ✔ Occlusions
Detects partially hidden soldiers and vehicles.

### ✘ Limitations
- Extremely small distant objects
- Heavy camouflage blending
- Low-light/night scenes

---

## 🛠 Tech Stack

**Modeling**
- Ultralytics YOLOv8
- PyTorch

**Data Handling**
- NumPy
- OpenCV

**Training Environment**
- Google Colab (T4 GPU)

**Deployment**
- Hugging Face Spaces (Free Tier)

---

## 📦 Inference & Submission Pipeline

The system:
- Runs batch inference on test images
- Generates YOLO-format `.txt` prediction files
- Maintains strict filename matching
- Packages results into a ZIP for submission

Example inference command:

```python
model.predict(source="/test/images", save_txt=True, conf=0.25)
