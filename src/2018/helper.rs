use std::time::{Instant};

pub fn time_it<F: Fn() -> T, T>(f: F) -> T {
    let start = Instant::now();
    let result = f();
    let duration = start.elapsed();
    println!("it took {duration:?}");
    result
}
