use std::collections::{HashMap};
use std::fs::read_to_string;
use std::ops::Mul;

use crate::helper::time_it;

mod helper;

trait Score<T> {
    fn score(&self) -> T;
}

impl<T: Mul<Output=T> + Copy> Score<T> for (T, T) {
    fn score(&self) -> T {
        let t = *self;
        t.0 * t.1
    }
}

fn get_lines() -> Vec<String> {
    read_to_string(file!().replace(".rs", ".txt")).unwrap()
        .split('\n')
        .map(|s| s.to_string())
        .filter(|s| s.len() > 1)
        .collect()
}

fn part1() {
    let result: usize = get_lines().into_iter().fold((0, 0), |(a, b), s| {
        let mut hm: HashMap<char, usize> = HashMap::new();
        for c in s.chars() {
            *hm.entry(c).or_insert(0) += 1;
        }
        (a + Into::<usize>::into(hm.values().any(|v| *v == 2usize)),
         b + Into::<usize>::into(hm.values().any(|v| *v == 3usize)))
    }).score();
    println!("Part 1: {result}")
}

fn part2() {
    let lines = get_lines();
    let mut result: Option<String> = None;
    'outer: for i in 1..lines.len() {
        let s1 = lines.get(i).unwrap();
        for j in 0..i {
            let s2 = lines.get(j).unwrap();
            let diff = s1.chars().zip(s2.chars()).filter(|(a, b)| *a != *b).count();
            if diff == 1 {
                result = Some(s1.chars().zip(s2.chars()).filter(|(a, b)| *a == *b).map(|(a, _)| a).collect());
                break 'outer;
            }
        }
    }
    println!("Part 2: {}", result.unwrap())
}

fn main() {
    time_it(part1);
    time_it(part2);
}
