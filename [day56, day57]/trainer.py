import json
import numpy as np
import keras
import tensorflowjs as tfjs
from keras.models import Sequential
from keras.layers import Dense, Dropout

with open('trainingData.json') as f:
    data = json.load(f)
    X = np.array(data['xs'])
    y = np.array(data['ys'])

X_train = X[:-10000]    
y_train = y[:-10000]    
X_test = X[-10000:]    
y_test = y[-10000:]
 
model = Sequential()
model.add(Dense(64,activation='relu', input_dim=6))
model.add(Dropout(0.5))
model.add(Dense(64,activation='relu')) 
model.add(Dropout(0.5))
model.add(Dense(3,activation='softmax'))

adam = keras.optimizers.Adam(lr=0.001)
model.compile(loss='categorical_crossentropy',optimizer=adam,metrics=['accuracy'])
model.fit(X_train,y_train,epochs=10,batch_size=128)

score = model.evaluate(X_test,y_test,batch_size=128)
print(score)
model.save('Keras-10epoch-64x2')

tfjs.converters.save_keras_model(model,"tfjsmodel")