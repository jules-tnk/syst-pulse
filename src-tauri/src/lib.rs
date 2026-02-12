use serde::{Deserialize, Serialize};
use sysinfo::System;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemStats {
    pub cpu: f32,
    pub memory: MemoryStats,
    pub disk: DiskStats,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryStats {
    pub total: u64,
    pub used: u64,
    pub percentage: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiskStats {
    pub total: u64,
    pub used: u64,
    pub percentage: f32,
}

#[tauri::command]
pub fn get_system_stats() -> SystemStats {
    let mut sys = System::new_all();
    sys.refresh_all();

    // CPU usage
    let cpu_usage = sys.global_cpu_usage();

    // Memory stats
    let total_memory = sys.total_memory();
    let used_memory = sys.used_memory();
    let memory_percentage = (used_memory as f32 / total_memory as f32) * 100.0;

    // Disk stats (root partition)
    let disk_total = fs::metadata("/").map(|_| {
        match nix::sys::statvfs::statvfs("/") {
            Ok(stats) => stats.blocks() * stats.block_size() as u64,
            Err(_) => 0,
        }
    }).unwrap_or(0);
    
    let disk_used = fs::metadata("/").map(|_| {
        match nix::sys::statvfs::statvfs("/") {
            Ok(stats) => (stats.blocks() - stats.blocks_available()) * stats.block_size() as u64,
            Err(_) => 0,
        }
    }).unwrap_or(0);

    let disk_percentage = if disk_total > 0 {
        (disk_used as f32 / disk_total as f32) * 100.0
    } else {
        0.0
    };

    SystemStats {
        cpu: cpu_usage,
        memory: MemoryStats {
            total: total_memory,
            used: used_memory,
            percentage: memory_percentage,
        },
        disk: DiskStats {
            total: disk_total,
            used: disk_used,
            percentage: disk_percentage,
        },
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_system_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}