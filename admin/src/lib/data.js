export const doughnutData = {
  labels: ["Search Engines", "Direct Click", "Bookmarks Click"],
  datasets: [
    {
      data: [30, 30, 40],
      backgroundColor: ["#38bdf8", "#34d399", "#fb7185"],
      borderWidth: 0
    }
  ]
};

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: { usePointStyle: true }
    }
  }
};


export const lineData = {
  labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"],
  datasets: [
    {
      label: "CHN",
      data: [40, 30, 20, 35, 25, 45, 30, 20],
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139,92,246,0.15)",
      tension: 0.4,
      fill: true,
      pointRadius: 4
    },
    {
      label: "USA",
      data: [25, 20, 30, 15, 40, 20, 35, 30],
      borderColor: "#fb7185",
      backgroundColor: "rgba(251,113,133,0.15)",
      tension: 0.4,
      fill: true,
      pointRadius: 4
    },
    {
      label: "UK",
      data: [30, 25, 35, 30, 20, 40, 25, 30],
      borderColor: "#38bdf8",
      backgroundColor: "rgba(56,189,248,0.15)",
      tension: 0.4,
      fill: true,
      pointRadius: 4
    }
  ]
};


export const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true
      }
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      grid: { color: "#f1f5f9" },
      ticks: {
        stepSize: 10
      }
    }
  }
};

