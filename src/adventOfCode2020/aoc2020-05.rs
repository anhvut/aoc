use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() -> Result<(), std::io::Error> {
    let lines = read_lines("./src/adventOfCode2020/aoc2020-05.txt")?;
    let mut values = lines
        .flatten()
        .map(|a| a.chars().map(|c| match c {
            'F'|'L' => '0',
            'B'|'R' => '1',
            _ => c }).collect::<String>())
        .flat_map(|c| i32::from_str_radix(&c, 2))
        .collect::<Vec<i32>>();
    values.sort();
    let values2 = values.iter().skip(1);
    println!("Biggest value {}", values.last().unwrap());
    let value3 = values.iter().zip(values2).find_map(|(&a, &b)| if a+1 != b {Some(a+1)} else {None});
    println!("First non consecutive value {}", value3.unwrap());
    Ok(())
}

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
    where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}