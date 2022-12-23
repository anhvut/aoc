mod helper;

#[derive(Debug)]
enum Direction {
    Forward,
    Down,
    Up
}

fn to_direction(d: &str) -> Option<Direction> {
    match d {
        "forward" => Some(Direction::Forward),
        "down" => Some(Direction::Down),
        "up" => Some(Direction::Up),
        _ => None
    }
}

type Reducer = fn((i32, i32, i32), &(Direction, i32)) -> (i32, i32, i32);
fn compute(nbs: &[(Direction, i32)], reducer: Reducer) -> i32 {
    let (horiz, depth, _): (i32, i32, i32) = nbs.iter().fold((0, 0, 0), reducer);
    horiz * depth
}

fn reducer1((mut h, mut d, a): (i32, i32, i32), (cmd, nb): &(Direction, i32)) -> (i32, i32, i32) {
    match cmd {
        Direction::Forward => h += nb,
        Direction::Down => d += nb,
        Direction::Up => d -= nb,
    };
    (h, d, a)
}

fn reducer2((mut h, mut d, mut a): (i32, i32, i32), (cmd, nb): &(Direction, i32)) -> (i32, i32, i32) {
    match cmd {
        Direction::Forward => {
            h += nb;
            d += a * nb
        },
        Direction::Down => a += nb,
        Direction::Up => a -= nb,
    };
    (h, d, a)
}

fn main() {
    let lines = helper::read_lines("./src/2021/aoc2021-02.txt").unwrap();
    let commands: Vec<(Direction, i32)> = lines
        .flat_map(|c| c.map(|n| {
            let tokens = n.split(' ').collect::<Vec<&str>>();
            (tokens.first().and_then(|t| to_direction(t)),
             tokens.get(1).and_then(|t| t.parse::<i32>().ok()))
        }))
        .flat_map(|t| match t {
            (Some(cmd), Some(nb)) => Some((cmd, nb)),
            _ => None
        })
        .collect();
    println!("Commands {commands:?}");
    println!("Part1: {}", compute(&commands, reducer1));
    println!("Part2: {}", compute(&commands, reducer2));
}
