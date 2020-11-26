#!/bin/env python3
import codecs
import pathlib
import typing


def textfiles(lang: str):
    return pathlib.Path('../satzkatalog/data/').glob(f'{lang}/**/*.txt')


def concat_textfile(file: pathlib.Path, dst: typing.IO):
    with file.open(encoding='utf-8-sig') as src:
        for line in src.readlines():
            line = line.strip('\r\n')
            line = line.replace('Line: Begin: ', 'Begin: ')
            line = line.replace('Line: End: ', 'End: ')
            print(line, file=dst)


for lang in 'AR CA DE EN ES FR IT'.split():
    dst_file = pathlib.Path(f'./src/assets/satzkatalog.{lang}.txt')
    with dst_file.open(mode='w', encoding='utf-8') as dst:
        print('Building', dst)
        for file in textfiles(lang):
            concat_textfile(file, dst)
