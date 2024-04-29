from flask import Flask, request, jsonify
from flask_cors import CORS

import base64
from PIL import Image
from io import BytesIO

from image_editor import ImageEditor


app = Flask(__name__)
CORS(app)



@app.route('/get_all_masks', methods=['POST'])
def get_all_masks():

    data = request.json
    
    if 'image' not in data:
        return jsonify({'error': 'No image data found'})
    
    image_data_url = data['image']
    image_data = base64.b64decode(image_data_url.split(',')[1])
    image = Image.open(BytesIO(image_data))

    all_masks = ImageEditor.getAllMasks(image)

    return jsonify({'success': True, 'message': all_masks})
    

if __name__ == "__main__":
    app.run(debug=True)