#!/bin/env python3
import datetime
import logging
import pathlib
import subprocess
import typing
import os

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
    src_date = subprocess.run(
        args=["git", "log", "-1", "--format=%ad", "--date=iso8601-strict"],
        capture_output=True,
        cwd=src_directory,
        encoding="utf-8",
    )
    src_date = datetime.datetime.fromisoformat(src_date.stdout.strip())
    dst_file = pathlib.Path(f"./public/assets/satzkatalog.{lang}.txt")
    with dst_file.open(mode="w", encoding="utf-8") as dst:
        logging.info("Building %s from %s (%s)", dst_file, src_directory, src_date)
        for file in sorted(src_files):
            concat_textfile(file, dst)
    os.utime(dst_file, times=(src_date.timestamp(), src_date.timestamp()))
