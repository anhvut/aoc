use std::fs::read_to_string;
use crate::helper::time_it;

mod helper;

fn get_nbs() -> Vec<u32> {
    read_to_string(file!().replace(".rs", ".txt")).unwrap()
        .split("\n\n")
        .map(|group| group
            .to_string()
            .split('\n')
            .flat_map(|c| c.parse::<u32>())
            .sum())
        .collect()
}

fn part1() {
    let result = get_nbs().into_iter().reduce(u32::max).unwrap();
    println!("Part 1: {result}")
}

fn best3((max1, max2, max3): (u32, u32, u32), &nb: &u32) -> (u32, u32, u32) {
    match nb {
        a if a >= max1 => (a, max1, max2),
        a if a >= max2 => (max1, a, max2),
        a if a >= max3 => (max1, max2, a),
        _ => (max1, max2, max3)
    }
}

fn part2() {
    let (a, b, c) = get_nbs().iter().fold((0u32, 0u32, 0u32), best3);
    println!("Part 2: {}", a + b + c)
}

fn main() {
    time_it(part1);
    time_it(part2);
}
