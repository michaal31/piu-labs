const api = new Ajax({ baseURL: "https://jsonplaceholder.typicode.com" });

const btnLoad = document.getElementById("btnLoad");
const btnError = document.getElementById("btnError");
const btnReset = document.getElementById("btnReset");
const list = document.getElementById("list");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");

function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

function showError(msg) {
  errorBox.textContent = msg;
}

function clearView() {
  list.innerHTML = "";
  errorBox.textContent = "";
  showLoader(false);
}

btnLoad.onclick = async () => {
  clearView();
  showLoader(true);
  try {
    const data = await api.get("/posts?_limit=5");
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.title;
      list.appendChild(li);
    });
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
};

btnError.onclick = async () => {
  clearView();
  showLoader(true);
  try {
    await api.get("/nieistnieje");
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
};

btnReset.onclick = () => clearView();