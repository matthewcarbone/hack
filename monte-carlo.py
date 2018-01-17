import numpy as np  # load the Numpy library


def sample_square(s):
    """Returns a two-entry array containing an x and y coordinate, ramdomly
    sampled over a square centered at the origin with side length s.

    :Input:
        - s (float, int) length of the side of the square

    :Raises:
        - TypeError if s is not of type float or int
        - ValueError if s is <= 0

    :Output:
        - r (numpy array) vector of points (x, y) representing a randomly
          sampled point

    """

    # ensure our input is of the proper type
    if not (type(s) == float or type(s) == int):
        raise TypeError("Side length s should be float or int only.")

    # confirm that we have a positive non-zero argument
    if s <= 0:
        raise ValueError("Side length should be a non-negative, nonzero "
                         "number.")

    # define the coordinates of r by calling the numpy random.ranf() method
    # twice - note we need to call it twice otherwise x = y
    # also, the random.ranf() method returns a random value in the range [0,1),
    # so in order to sample properly, we have to modify this value
    s = s / 0.5
    x = (np.random.ranf() - 0.5) * s
    y = (np.random.ranf() - 0.5) * s

    return np.array([x, y])

z = 1.0
print type(z)

for i in range(0, 10):
    print(sample_square(z))


def main():
    pass


if __name__ == '__main__':
    main()
