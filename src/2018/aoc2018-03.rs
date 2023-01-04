use std::collections::HashSet;
use std::fmt;
use std::fs::read_to_string;
use std::iter::repeat;
use std::ops::{Add, Index, IndexMut, Range};
use regex::Regex;

use crate::helper::time_it;

mod helper;

#[derive(Debug)]
struct Record {
    id: u32,
    xx: Range<usize>,
    yy: Range<usize>,
}

impl Record {
    fn new(id: u32, x: usize, y: usize, w: usize, h: usize) -> Record { Record { id, xx: x..x + w, yy: y..y + h } }
}

trait Dimension {
    fn width(&self) -> usize;
    fn height(&self) -> usize;
}

impl Dimension for Vec<Record> {
    fn width(&self) -> usize {
        self.iter().map(|r| r.xx.end + 1).max().unwrap()
    }

    fn height(&self) -> usize {
        self.iter().map(|r| r.yy.end + 1).max().unwrap()
    }
}

#[derive(Debug)]
struct Map<T>(Vec<Vec<T>>);

impl<T> Map<T>
    where T: Add<Output=T>, T: Clone {
    // create vector of vector filled with 0
    fn new(width: usize, height: usize, zero: T) -> Map<T> {
        Map(repeat(0).take(height)
            .into_iter()
            .map(|_| repeat(zero.clone())
                .take(width)
                .collect::<Vec<T>>())
            .collect::<Vec<Vec<T>>>())
    }
}

impl<T> fmt::Display for Map<T>
    where T: fmt::Display {
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

impl<'a, T> IntoIterator for &'a Map<T> {
    type Item = &'a Vec<T>;
    type IntoIter = core::slice::Iter<'a, Vec<T>>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.iter()
    }
}

impl<T> Index<usize> for Map<T> {
    type Output = Vec<T>;

    fn index(&self, index: usize) -> &Self::Output {
        self.0[index].as_ref()
    }
}

impl<T> IndexMut<usize> for Map<T> {
    fn index_mut(&mut self, index: usize) -> &mut Self::Output {
        self.0[index].as_mut()
    }
}

trait RangeExt {
    fn intersects(&self, other: &Self) -> bool;
    fn intersects2d(&self, y: &Self, x2: &Self, y2: &Self) -> bool;
}

impl<T> RangeExt for Range<T>
    where T: PartialOrd,
{
    fn intersects(&self, other: &Self) -> bool {
        self.contains(&other.start) || other.contains(&self.start)
    }

    fn intersects2d(&self, y: &Self, x2: &Self, y2: &Self) -> bool {
        self.intersects(x2) && y.intersects(y2)
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
            Record::new(nbs[0] as u32, nbs[1], nbs[2], nbs[3], nbs[4])
        })
        .collect()
}

fn part1() {
    let records = get_lines();
    let width = records.width();
    let height = records.height();
    let mut map: Map<usize> = Map::new(width, height, 0);
    for rec in records {    // NB: records is moved
        for j in rec.yy {
            for i in rec.xx.clone() {   // NB: no into_iterator on &Range
                map[j][i] += 1;
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

fn part2() {
    let records = get_lines();
    let mut overlap: HashSet<u32> = HashSet::new();
    for i in 0..records.len() {
        let a = &records[i];
        for b in &records[i + 1..] {
            if a.xx.intersects2d(&a.yy, &b.xx, &b.yy) {
                overlap.insert(a.id);
                overlap.insert(b.id);
            }
        }
    }
    let result = records.iter().find_map(|r| if !overlap.contains(&r.id) { Some(r.id) } else { None }).unwrap();
    println!("Part 2: {result}");
}

fn main() {
    time_it(part1);
    time_it(part2);
}
