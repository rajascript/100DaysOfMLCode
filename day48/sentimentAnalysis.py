import tflearn

...
# load our saved model
model = train_autoencoder.build_model()
model = tflearn.DNN(model)
model.load('./b8156')

model.predict("Hello");