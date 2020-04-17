#Script that adds a full video include the video as usual and in reverse, then stiches it into one
#Requires ffmpeg either in the same directory or in PATH
import os
import time

for filename in os.listdir(os.getcwd()):
    if filename != "script.py" and filename != "credits.txt":
        print("Reversing: " + filename)
        os.system('ffmpeg -i "' + os.getcwd() + '\\' + filename + '" -vf reverse "' + os.getcwd() + '\\rev-' + filename + '"')
        print("Creating Text File: " + filename)
        f = open(os.getcwd() + '\\list.txt', "a")
        f.write("file '" + os.getcwd() + '\\' + filename + "'" + '\n')
        f.write("file '" + os.getcwd() + '\\rev-' + filename + "'")
        f.close()
        commandRun = 'ffmpeg -f concat -safe 0 -i "' + os.getcwd() + '\\list.txt' + '" -c copy "' + os.getcwd() + '\\full-' + filename + '"'
        print("About to run: " + commandRun)
        os.system(commandRun)
        os.remove(os.getcwd() + '\\list.txt')
        os.remove(os.getcwd() + '\\rev-' + filename)


