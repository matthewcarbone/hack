import numpy as np               # load the Numpy library
import matplotlib.pyplot as plt  # load matplotlib for plotting
import sys                       # for clean console output
import time                      # for the sleep functionality

plt.rc('text', usetex=True)      # for fancy LaTeX text in the plots
plt.rc('font', family='serif')


def sample_square(s):
    """Returns a two-entry array containing an x and y coordinate, ramdomly
    sampled over a square centered at the origin with side length s.

    :Input:
        - s (float, int) length of the side of the square

    :Raises:
        - TypeError if s is not of type float or int
        - ValueError if s is <= 0

    :Output:
        - Two points (x, y) representing a randomly sampled point

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
    x = (np.random.ranf() - 0.5) * s
    y = (np.random.ranf() - 0.5) * s

    return x, y


def area_of_circle(r, N):
    """Returns the area of the circle as estimated by the Monte-Carlo method.

    :Input:
        - r (float, int) radius of the circle one wishes to estimate the
          area of
        - N (int) number of sample points one wishes to take

    :Output:
        - The estimated area of the circle

    """

    hits = 0
    s = 2.0*r

    # r = s/2 => s = 2r
    for i in range(0, N):
        x, y = sample_square(s)
        if np.sqrt(x*x + y*y) <= r:
            hits += 1

    # the area of a square of side length s is s^2, so s^2*hits/N should
    # provide the area of the circle since hits/N is the ratio of the two areas

    return s*s*hits/N


def order(xx, er, o):
    return np.exp(np.log(er) - o * np.log(xx))


def plot_err(x, y):
    plt.loglog(x, y, 'ko', label="Sampled Errors")

    mesh = np.linspace(x[0], x[-1], 1000)
    plt.loglog(mesh, order(mesh[-1], y[-1], 0.0)*mesh**(0.0),
               'g', label=r"$1.0$")
    plt.loglog(mesh, order(mesh[-1], y[-1], -0.5)*mesh**(-0.5),
               'r', label=r"$N^{-1/2}$")
    plt.loglog(mesh, order(mesh[-1], y[-1], -1.0)*mesh**(-1.0),
               'b', label=r"$N^{-1}$")
    plt.xlabel(r"$N$")
    plt.ylabel("Relative Error")

    plt.legend()
    plt.savefig('error.png', format='png', dpi=900)
    plt.close("all")


def statistical_analysis(maxlog):
    vecN = np.logspace(1, maxlog, maxlog*3)
    vecMCerr = []
    vecMC = []

    # the true answer is pi
    analytical = np.pi

    # for every term in vecN, execute L Monte-Carlo samplings,
    # sum and average these results

    cc = 0  # counter

    print("Executing Monte-Carlo method...")
    for n in vecN:
        cc += 1

        n = int(n)

        val = area_of_circle(1.0, n)

        # append the value
        vecMC.append(val)

        # append the relative error
        vecMCerr.append(np.abs(val - analytical)/analytical)

        sys.stdout.write("Progress: %d%%   \r" % (100.0*cc/(maxlog*3)))
        sys.stdout.flush()

    print('\n')

    # plot the output to the working directory
    sys.stdout.write("Plotting... \r")
    sys.stdout.flush()
    plot_err(vecN, np.array(vecMCerr))

    print("Plotting... Done, check error.png for output.\n")

    return vecN, vecMC


def main():
    print("\nMonte-Carlo (monte-carlo.py) will do the following: \n"
          "    1. For each of a set of values [N0, ..., Nf], calculate\n"
          "       the Monte-Carlo sampling value for the area of a circle.\n"
          "    2. Output the value for the area of the circle with r=1\n"
          "       for each of these N's.\n"
          "    3. Output the plot error.png to the working directory, which\n"
          "       displays the relative error (compared with the exact\n"
          "       analytical answer) as a function of N, in addition to\n"
          "       plotting some lines that demonstrate the approximate\n"
          "       scaling of this method.\n")

    x, y = statistical_analysis(6)

    time.sleep(1)

    print("Values for pi as a function of N:\n")
    print("      N           pi   ")
    print("-----------------------")
    for i in range(0, len(x)):
        print("%E | %f" % (x[i], y[i]))
    print("\n")




if __name__ == '__main__':
    main()
