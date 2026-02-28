
/**
 * Predict function to call the custom YOLO model hosted on Hugging Face Spaces.
 * Endpoint: https://lazypanda0103-yolo.hf.space/predict/
 */
export async function predictImage(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', file);

  const apiUrl = import.meta.env.VITE_YOLO_API_URL || 'https://lazypanda0103-yolo.hf.space/predict/';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error detail available');
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    return await response.blob();
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      console.error('Network Error / CORS Issue:', error);
      throw new Error(
        'Connection failed (CORS Error). \n\n' +
        'Fix 1: Visit the Space at https://huggingface.co/spaces/lazypanda0103/yolo to wake it up.\n' +
        'Fix 2: Ensure your FastAPI backend has CORSMiddleware enabled for allow_origins=["*"].'
      );
    }
    throw error;
  }
}
