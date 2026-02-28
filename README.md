# 🛰️ VisionQuest — Military Object Detection (YOLOv8s)

**Live Demo:** https://vision-quest-jet.vercel.app/#analysis-tool

This project uses **YOLOv8s** to detect military objects in images:
- Soldiers
- Aircraft
- Warships
- Vehicles

## 🚀 Model Summary

- **Architecture:** YOLOv8s  
- **Epochs:** 50  
- **Image Size:** 640×640  
- **Optimizer:** AdamW  
- **Final mAP@50:** **0.478**  
- **Model Size:** ~22MB  
- **CPU Inference:** ~25–35ms/img  
- **GPU Inference:** ~7–10ms/img

---

## 🛠️ Training

```python
from ultralytics import YOLO

model = YOLO("yolov8s.pt")
model.train(data="military_dataset.yaml", epochs=50, imgsz=640)
