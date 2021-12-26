mod helper;

fn compute(nbs: &Vec<i32>) -> i32 {
    let values2 = nbs.iter().skip(1);
    nbs.iter().zip(values2).map(|(a, b)| if b > a {1} else {0}).sum()
}

fn main() {
    let lines = helper::read_lines("./src/2021/aoc2021-01.txt").unwrap();
    let nbs = lines
        .flat_map(|c| c.map(|n| n.parse::<i32>()))
        .flatten()
        .collect::<Vec<i32>>();
    println!("Nbs {:?}", nbs);
    println!("Part1: {}", compute(&nbs));

    let prev1 = nbs.iter().skip(1);
    let prev2 = nbs.iter().skip(2);
    let nbs2 = nbs.iter().zip(prev1).zip(prev2).map(|((a, b), c)| a+b+c).collect::<Vec<i32>>();
    println!("Part2: {}", compute(&nbs2));
}
