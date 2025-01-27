#!/bin/env python3
import logging
import pathlib
import typing

logging.basicConfig(level=logging.INFO)


def concat_textfile(file: pathlib.Path, dst: typing.IO):
    with file.open(encoding="utf-8-sig") as src:
        for line in src.readlines():
            line = line.strip("\r\n")
            line = line.replace("Line: Begin: ", "Begin: ")
            line = line.replace("Line: End: ", "End: ")
            print(line, file=dst)


for lang in "CA DE EN ES FR IT OC".split():
    src_directory = pathlib.Path("../satzkatalog/data/")
    src_files = src_directory.glob(f"{lang}/**/*.txt")
    dst_file = pathlib.Path(f"./public/assets/satzkatalog.{lang}.txt")
    with dst_file.open(mode="w", encoding="utf-8") as dst:
        logging.info("Building %s from %s", dst_file, src_directory)
        for file in sorted(src_files):
            concat_textfile(file, dst)
