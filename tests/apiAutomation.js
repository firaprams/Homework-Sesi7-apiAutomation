const { expect } = require("chai");

describe("API Automation Tests - Sesi 7 Website Belajar Bareng on Render", () => {
  // Variabel untuk menyimpan token secara global di dalam test suite
  let authToken = "";

  // 1. Sample Request POST (Login)
  it("Valid Login - Seharusnya mengembalikan token dan status 200.", async function () {
    const response = await fetch("https://belajar-bareng.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin",
      }),
    });

    const data = await response.json();

    // Simpan token untuk digunakan di test case berikutnya
    authToken = data.token;

    // 2 Assertions
    expect(response.status).to.equal(200);
    expect(data).to.have.property("token");
  });

  // 2. Sample Request GET (List Users)
  it("Get User - Seharusnya mengembalikan detail pengguna dan status 200.", async function () {
    const response = await fetch("https://belajar-bareng.onrender.com/api/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // 2 Assertions (Membaca array di dalam properti 'users')
    expect(response.status).to.equal(200);
    expect(data.users[0]).to.have.property("username");
  });

  // 3. Sample Request POST (Add User) - Positive Case
  it("Add User Positive Case - Seharusnya membuat pengguna dan mengembalikan status 201.", async function () {
    const response = await fetch("https://belajar-bareng.onrender.com/api/add-user", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Masako",
        age: 25,
      }),
    });

    const data = await response.json();

    // 2 Assertions
    expect(response.status).to.equal(201);
    expect(data.username).to.equal("Masako");
  });

  // 4. Sample Request POST (Add User) - Negative Case
  it("Add User Negative Case - Harus mengembalikan status error 401 jika token tidak ada", async function () {
    const response = await fetch("https://belajar-bareng.onrender.com/api/add-user", {
      method: "POST",
      headers: {
        // Sengaja tidak mengirimkan header Authorization untuk memicu error 401
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "UnauthorizedUser",
        age: 25,
      }),
    });

    const data = await response.json();

    // 2 Assertions (Validasi proteksi keamanan API)
    expect(response.status).to.equal(401);
    expect(data).to.have.property("message");
  });
});
