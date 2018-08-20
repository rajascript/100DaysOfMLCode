import input_data
mnist = input_data.read_data_sets('/tmp/data',one_hot=True)

import tensorflow as tf

#params
learning_rate = 0.01
training_iteration = 30
batch_size = 100
display_step = 2

x = tf.placeholder("float", [None, 784])
y = tf.placeholder("float", [None, 10])

#weights
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))

