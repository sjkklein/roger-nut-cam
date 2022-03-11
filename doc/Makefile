ORIGINAL_FILES = $(wildcard *.puml)               # get list of .puml files
COVERTED_FILES = $(patsubst %.puml, %.png, $(ORIGINAL_FILES)) # make list out .png files to output

all: $(COVERTED_FILES)  # target is all the converted .png files

%.png: %.puml
	java -jar plantuml.jar $<	

.PHONY:clean

clean: 
	rm -f *.png