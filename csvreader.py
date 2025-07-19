import csv
with open('WORLDS 24-25 STL Robotics Parts Order - Structure, Motion, and Others.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    items = []
    for row in spamreader:
        temp = []
        for i in range(7):
            if(row[i] != "" or row [i] != "$0.00"):
                temp.append(row[i])
        items.append(temp)
    for item in items:
        print(item)
    items.pop(0)