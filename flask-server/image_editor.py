import io
import base64

import cv2
from ultralytics import YOLO
import numpy as np
import torchvision.transforms.functional as F
from PIL import Image

class ImageEditor:
    def getAllMasks(image):
        # Run model to get the bounding box and mask coordinates
        img = np.array(image)
        model = YOLO('yolov8s-seg.pt')

        results = model.predict(source=img.copy(), save=False, save_txt=False, stream=True)

        all_masks = []

        # iterate detection results 
        for r in results:
            # iterate each object contour 
            for ci,c in enumerate(r):    
                box_coords = c.boxes.xyxyn.tolist().pop()
                b_mask = np.zeros(img.shape[:2], np.uint8)   
               
                contour = c.masks.xy.pop().astype(np.int32).reshape(-1, 1, 2)
                _ = cv2.drawContours(b_mask, [contour], -1, (255, 255, 255), cv2.FILLED)        

                edited_mask_3ch = cv2.cvtColor( b_mask , cv2.COLOR_GRAY2BGR)

                # Apply the edited mask back to the original image
                edited_image = cv2.bitwise_and(img, edited_mask_3ch)

                edited_image_rgba = cv2.cvtColor(edited_image, cv2.COLOR_BGR2BGRA)
                edited_image_rgba[:, :, 3] =  b_mask  # Set the alpha channel values
    
                base64_mask = ImageEditor.convertMaskToBase64(edited_image_rgba)
                all_masks.append({"box": box_coords, "mask": base64_mask})
        
        return all_masks

    def convertMaskToBase64(mask):
        image = Image.fromarray(mask)

        # Create an in-memory binary stream
        img_io = io.BytesIO()

        # Save the image to the in-memory stream in PNG format
        image.save(img_io, format='PNG')

        # Get the image data as a byte string
        img_data = img_io.getvalue()

        # Encode the image data as Base64
        base64_encoded = base64.b64encode(img_data)

        # Convert the bytes-like object to a string
        base64_string = base64_encoded.decode('utf-8')

        return base64_string
    
