use std::collections::HashSet;
use std::fs::read_to_string;
use std::ops::Add;
use crate::helper::time_it;

mod helper;

fn get_nbs() -> Vec<i32> {
    read_to_string(file!().replace(".rs", ".txt")).unwrap()
        .split('\n')
        .flat_map(|c| c.parse::<i32>())
        .collect()
}

fn part1() {
    let result: i32 = get_nbs().iter().sum();
    println!("Part 1: {result}")
}

struct CumulateSum<A, I> {
    current: Option<A>,
    iter: I,
}

impl<A, I> CumulateSum<A, I> {
    fn new(start: A, iter: I) -> Self {
        CumulateSum { current: Some(start), iter }
    }
}

impl<A, I> Iterator for CumulateSum<A, I>
    where
        A: Copy + Add<Output=A>,
        I: Iterator<Item=A>,
{
    type Item = A;

    fn next(&mut self) -> Option<Self::Item> {
        self.current = match (self.current, self.iter.next()) {
            (None, _) => None,
            (_, None) => None,
            (Some(a), Some(b)) => Some(a + b)
        };
        self.current
    }
}

fn part2() {
    let nbs = get_nbs();
    let cumulate = CumulateSum::new(0, nbs.into_iter().cycle());
    let mut known = HashSet::new();
    let mut result = 0;
    known.insert(0);
    for n in cumulate {
        if !known.insert(n) {
            result = n;
            break;
        }
    };
    println!("Part 2: {result}")
}

fn main() {
    time_it(part1);
    time_it(part2);
}
