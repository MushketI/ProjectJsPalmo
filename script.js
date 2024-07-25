window.addEventListener("DOMContentLoaded", (event) => {
  const content = document.querySelector(".products")
  const cartContent = document.querySelector(".cart__products")
  let products = []
  let order = JSON.parse(localStorage.getItem("order"))
    ? JSON.parse(localStorage.getItem("order"))
    : []

  document.querySelector(".sup").textContent = order.length

  async function getProduct() {
    await fetch("https://6342f482ba4478d47845c76e.mockapi.io/basicJSPalmo")
      .then((response) => response.json())
      .then((data) => {
        products = [...data]
      })
      .catch((error) => {
        viewError(error)
      })

    viewProducts(products)
  }

  function viewError(str) {
    content.innerHTML = `
      <div class="error">
        <h2>Opsss, error 404</h2>
        <p>${str}</p>
      </div>
    `
  }

  function viewProducts(arr) {
    arr.forEach((item) => {
      content.innerHTML += `
      <div class="cart">
        <div class="img__cart">
          <img
            class="image"
            src="${item.imageUrl}"
            alt=""
          />
        </div>
        <div class="title__cart">
          <span class="title">${item.title}</span>
        </div>
        <div class="brand__cart">
          <span class="brand">${item.brand}</span>
        </div>
        <div class="price__cart">
          <span class="price">${item.price} $</span>
        </div>
        <div class="order__cart ">
          <button class="add__cart hide">Добавить</button>
        </div>
        <input class="hidden" type="hidden" value="${item.id}" />
      </div>
  `
    })

    content.querySelectorAll(".cart").forEach((item) => {
      item.addEventListener("mouseover", (e) => {
        item.querySelector(".hide").classList.remove("hide")
      })

      item.addEventListener("mouseout", (e) => {
        item.querySelector(".add__cart").classList.add("hide")
      })
    })

    content.querySelectorAll(".cart").forEach((item) => {
      let cartId = item.querySelector("input").value
      if (order.some((el) => el.id === cartId)) {
        item.querySelector(".add__cart").disabled = true
      }
    })
  }

  function cartView() {
    const cartBtn = document.querySelector("#btnOrder")
    const cartBack = document.querySelector("#btn__back")

    cartBtn.addEventListener("click", (e) => {
      document.querySelector(".main").classList.toggle("hide")
      document.querySelector(".basket").classList.toggle("hide")
    })

    cartBack.addEventListener("click", (e) => {
      document.querySelector(".main").classList.toggle("hide")
      document.querySelector(".basket").classList.toggle("hide")
    })
  }

  function addToCart() {
    content.addEventListener("click", (e) => {
      if (e.target.tagName == "BUTTON") {
        let cart = e.target.closest(".cart")

        let id = cart.querySelector("input").value

        let obj = {
          id: id,
          img: cart.querySelector(".image").src,
          title: cart.querySelector(".title").innerText,
          brand: cart.querySelector(".brand").innerText,
          price: cart.querySelector(".price").innerText,
        }

        if (!order.some((el) => el.id === id)) {
          order.push(obj)
        }

        localStorage.setItem("order", JSON.stringify(order))

        document.querySelector(".sup").textContent = order.length

        if (order.some((el) => el.id === id)) {
          cart.querySelector(".add__cart").disabled = true
        }

        viewProductInCart(order)
      }
    })
  }

  function viewProductInCart(arr) {
    if (arr.length == 0) {
      console.log("cart null")

      cartContent.innerHTML += `
        <div class="empty">
            <h2 class="empty__text" >Корзина пуста</h2>
        </div>
       `

      document.querySelector(
        ".total__text"
      ).innerHTML = `<h2 class="total__text">Total:  </h2>`
    } else {
      cartContent.innerHTML = ``
      arr.forEach((item) => {
        cartContent.innerHTML += `
        <div class="cart__product">
            <img class="cart__img" src="${item.img}" alt="img">
            <div class="cart__name">
            <h2>${item.title}</h2>
            <span>${item.price}</span>
            </div>
            <input type="hidden" value="${item.id}" />
            <button class="cart__delete"><img class="delete__png" src="image/delete.png" alt="img"></button>
        </div>
       `
      })

      cartContent.querySelectorAll(".cart__product").forEach((item) => {
        item.querySelector(".cart__delete").addEventListener("click", () => {
          let cartId = item.querySelector("input").value
          let newArr = arr.filter((item) => item.id !== cartId)

          localStorage.setItem("order", JSON.stringify(newArr))

          item.remove()

          document.querySelector(".sup").textContent = newArr.length

          document.querySelectorAll(".cart").forEach((item) => {
            if (item.querySelector("input").value === cartId) {
              item.querySelector(".add__cart").disabled = false
            }
          })

          viewProductInCart(newArr)
        })
      })

      let sum = arr
        .map((item) => +item.price.slice(0, -1))
        .reduce((partialSum, a) => partialSum + a, 0)

      document.querySelector(
        ".total__text"
      ).innerHTML = `<h2 class="total__text">Total: ${sum} $</h2>`
    }
  }

  viewProductInCart(order)
  cartView()
  addToCart()
  getProduct()
})
