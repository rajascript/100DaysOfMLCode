from numpy import exp,array,random,dot
class NeuralNetwork():
	def __init__(self):
		random.seed(1)
		
		self.synaptic_weights = 2 * random.random((3,1)) -1
		
	def __sigmoid(self, x):
		return 1/(1 + exp(-x))
	def train(self, training_set_inputs, training_set_outputs, number_it):
		for(iter in xrange(number_iter))	
def predict(self, inputs):
		return self.__sigmoid(dot(inputs, self.synaptic_weights))
	
if __name__ = '__main__':
	
	neural_network = NeuralNetwork()
	
	print 'Random starting synaptic weights:'
	print neural_network.synaptic_weights
	
	inputs = array([[0,0,1],[1,1,1],[1,0,1],[0,1,1]])
	outputs = array([[0,1,1,0]]).T
	
	neural_network.train(inputs, outputs, 10000)

	print 'New synaptic weights after training'
	print neural_network.synaptic_weights

	print 'predicting:'
	
	print neural_network.think(array([1,0,0]))
