
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import matplotlib as plt


model = load_model('mymodel.h5')

def load_image(img_path, show=False):

    img = image.load_img(img_path, target_size=(150, 150))
    img_tensor = image.img_to_array(img)                    # (height, width, channels)
    img_tensor = np.expand_dims(img_tensor, axis=0)         # (1, height, width, channels), add a dimension because the model expects this shape: (batch_size, height, width, channels)
    img_tensor /= 255.                                      # imshow expects values in the range [0, 1]
    return img_tensor
  
#img_path = 'C:/Users/Ferhat/Python Code/Workshop/Tensoorflow transfer learning/blue_tit.jpg'

for i in range(1, 10):
	img_path = './test/t2 ({}).jpeg'.format(i)
	new_image = load_image(img_path)

	pred = model.predict(new_image)


	predicted = list(pred[0])
	print(pred)

	print(predicted.index(max(predicted)))