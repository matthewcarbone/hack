import numpy as np               # load the Numpy library
import time                      # for clocking the time the algorithms take


def poly(x, c, method):
    """Calculates the polynomial

    f(x) + c0 + c1*x + c2*x^2 + ... + cn*x^n

    using the brute force method or Horner's algorithm, depending on the
    setting of variable 'method'. The order of the polynomial is given by
    the length of c minus 1, since we must account for the constant
    coefficient.
    """

    xx = 0.0

    if method == 'bruteforce':
        c.reverse()
        for i in range(0, len(c)):
            xx += c[i]*x**i

        return xx

    elif method == 'horner':
        for cc in c:
            xx = xx * x + cc

    else:
        raise ValueError("Variable method should be 'horner' or 'bruteforce'.")

    return xx


def main():

    # generate a random coefficient vector
    c = np.ndarray.tolist(np.random.rand(100000000))

    start = time.clock()
    val = poly(0.9, c, 'horner')
    print("It takes %s seconds to execute Horner's algorithm for polynomial\n"
          "of order %s. Evaluates to %s."
          % ((time.clock() - start), len(c)-1, val))

    start = time.clock()
    val = poly(0.9, c, 'bruteforce')
    print("It takes %s seconds to execute bruteforce method for polynomial\n"
          "of order %s. Evaluates to %s."
          % ((time.clock() - start), len(c)-1, val))


if __name__ == '__main__':
    main()
