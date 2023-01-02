use std::collections::HashSet;
use std::fmt;
use std::fs::read_to_string;
use std::iter::repeat;
use std::ops::{Index, IndexMut};
use regex::Regex;

use crate::helper::time_it;

mod helper;

#[derive(Debug)]
struct Record {
    id: usize,
    x: usize,
    y: usize,
    w: usize,
    h: usize,
}

impl Record {
    fn new(id: usize, x: usize, y: usize, w: usize, h: usize) -> Record { Record { id, x, y, w, h } }
}

trait Dimension {
    fn width(&self) -> usize;
    fn height(&self) -> usize;
}

impl Dimension for Vec<Record> {
    fn width(&self) -> usize {
        self.iter().map(|r| r.x + r.w + 1).max().unwrap()
    }

    fn height(&self) -> usize {
        self.iter().map(|r| r.y + r.h + 1).max().unwrap()
    }
}

#[derive(Debug)]
struct Map(Vec<Vec<usize>>);

impl Map {
    // create vector of vector filled with 0
    fn new(width: usize, height: usize) -> Map {
        Map(repeat(0).take(height)
            .into_iter()
            .map(|_| repeat(0)
                .take(width)
                .collect::<Vec<usize>>())
            .collect::<Vec<Vec<usize>>>())
    }
}

impl fmt::Display for Map {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for row in self {   // would need to loop in &self.0 if no IntoIterator for &Map
            for cell in row {
                write!(f, "{cell} ")?;
            }
            writeln!(f)?;
        }
        Ok(())
    }
}

impl<'a> IntoIterator for &'a Map {
    type Item = &'a Vec<usize>;
    type IntoIter = core::slice::Iter<'a, Vec<usize>>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.iter()
    }
}

impl Index<usize> for Map {
    type Output = Vec<usize>;

    fn index(&self, index: usize) -> &Self::Output {
        self.0[index].as_ref()
    }
}

impl IndexMut<usize> for Map {
    fn index_mut(&mut self, index: usize) -> &mut Self::Output {
        self.0[index].as_mut()
    }
}


fn get_lines() -> Vec<Record> {
    let re = Regex::new(r"^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$").unwrap();
    read_to_string(file!().replace(".rs", ".txt")).unwrap()
        .split('\n')
        .filter(|s| s.len() > 1)
        .map(|s| {
            let caps = re.captures(s).unwrap();
            let nbs: Vec<usize> = caps.iter()
                .map(|c| c.unwrap().as_str())
                .skip(1)
                .map(|c| c.parse::<usize>().unwrap()).collect();
            Record::new(nbs[0], nbs[1], nbs[2], nbs[3], nbs[4])
        })
        .collect()
}

fn part1() {
    let records = get_lines();
    let width = records.width();
    let height = records.height();
    let mut map = Map::new(width, height);
    for rec in &records {
        for j in 0..rec.h {
            for i in 0..rec.w {
                map[rec.y + j][rec.x + i] += 1;
            }
        }
    }
    let mut result = 0;
    for j in 0..height {
        for i in 0..width {
            result += <bool as Into<usize>>::into(map[j][i] > 1);
        }
    }
    println!("Part 1: {result}");
}

fn between(xb: usize, x: usize, xe: usize) -> bool { xb <= x && x < xe }

fn intersects(xb1: usize, xe1: usize, xb2: usize, xe2: usize) -> bool {
    between(xb1, xb2, xe1) || between(xb2, xb1, xe2)
}

fn intersects2d(x: usize, y: usize, xe: usize, ye: usize, x2: usize, y2: usize, xe2: usize, ye2: usize) -> bool {
    intersects(x, xe, x2, xe2) && intersects(y, ye, y2, ye2)
}

fn part2() {
    let records = get_lines();
    let mut overlap: HashSet<usize> = HashSet::new();
    for i in 0..records.len() {
        let a = &records[i];
        for j in (i + 1)..records.len() {
            let b = &records[j];
            if intersects2d(a.x, a.y, a.x + a.w, a.y + a.h, b.x, b.y, b.x + b.w, b.y + b.h) {
                overlap.insert(a.id);
                overlap.insert(b.id);
            }
        }
    }
    let result = records.iter().find(|&r| !overlap.contains(&r.id)).unwrap().id;
    println!("Part 2: {result}");
}

fn main() {
    time_it(part1);
    time_it(part2);
}
