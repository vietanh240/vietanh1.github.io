def la_SNT(x):
	if x<2:
		return False
	elif x == 2:
		return True
	elif x % 2 == 0:
		return False
	else:
		for i in range(3, x, 2):
			if (x % i == 0):
				return False
	return True					
counter = 0;
for i in range(1, 101):
	if la_SNT(i):
		counter += 1
		print(i, end="" )
print("______________")
print("Tổng SNT trong phạm vi này là: ", counter)
