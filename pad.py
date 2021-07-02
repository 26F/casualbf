
from PIL import Image

ifile = open("data.txt", 'r')

ints = [int(x) for x in ifile.read().split(' ')]

ifile.close()

sqr = int(len(ints) ** (1/2))

index = 0;

newimg = Image.new("RGB", (sqr, sqr))

for y in range(sqr):
	for x in range(sqr):
		shade = ints[index]
		newimg.putpixel((x, y), (shade, shade, shade))
		index += 1

newimg.save("huge.png", "PNG")
