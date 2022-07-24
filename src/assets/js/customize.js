//DATA TABLE
$(document).ready(function () {
  //GLOBAL DATA TABLE
  ("use strict");
  $("#data-datatable").DataTable({
    language: {
      paginate: {
        previous: "<i class='mdi mdi-chevron-left'>",
        next: "<i class='mdi mdi-chevron-right'>",
      },
      info: "Showing agents _START_ to _END_ of _TOTAL_",
      lengthMenu:
        '<select class=\'form-select form-select-sm ms-1 me-1\'><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="-1">All</option></select>',
    },
    pageLength: 20,
    select: { style: "multi" },
    order: [[1, "desc"]],
    drawCallback: function () {
      $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
        $("#data-datatable_length label").addClass("form-label"),
        document
          .querySelector(".dataTables_wrapper .row")
          .querySelectorAll(".col-md-6")
          .forEach(function (e) {
            e.classList.add("col-sm-6"),
              e.classList.remove("col-sm-12"),
              e.classList.remove("col-md-6");
          });
    },
  });
});

/******************************************************
 * ******************* VARIABLE **********************
 * ****************************************************/
let products = [];
let rowId;
let lastNote = "";
/******************************************************
 * ******************* FUNCTIONS **********************
 * ****************************************************/
function dataTable(table_name, index) {
  "use strict";
  $(`#${table_name}`).DataTable({
    language: {
      paginate: {
        previous: "<i class='mdi mdi-chevron-left'>",
        next: "<i class='mdi mdi-chevron-right'>",
      },
      info: "Showing agents _START_ to _END_ of _TOTAL_",
      lengthMenu:
        '<select class=\'form-select form-select-sm ms-1 me-1\'><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="-1">All</option></select>',
    },
    pageLength: 20,
    select: { style: "multi" },
    order: [[index, "desc"]],
    drawCallback: function () {
      $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
        $("#data-datatable_length label").addClass("form-label"),
        document
          .querySelector(".dataTables_wrapper .row")
          .querySelectorAll(".col-md-6")
          .forEach(function (e) {
            e.classList.add("col-sm-6"),
              e.classList.remove("col-sm-12"),
              e.classList.remove("col-md-6");
          });
    },
  });
}
function addProductTableRow(res, productTable, cartTable) {
  //for add to cart button
  let elem = $(`
  <button class="btn btn-success btn-sm">
          Add to cart
      </button>
  `);
  elem.click(function () {
    let data = res;
    productTable.row($(this).parents("tr")).remove().draw();
    addCartTableRow(data, productTable, cartTable);
    //ADD 1 PRODUCT
    products.push({
      product_id: res._id,
      qty: 1,
      isReturn: res.isReturn,
    });
    //DISPLAY TOTAL
    $(`#cart-total-${data._id}`).html(data.price);
  });
  productTable.row
    .add([
      ` <img src="${res.img}" alt="contact-img" title="contact-img" class="rounded me-3" height="64" />
      <p class="m-0 d-inline-block align-middle font-16">
          <a href="apps-ecommerce-products-details.html" class="text-body">${res.name}</a>
          <br/>
          <small class="me-2"><b>Category:</b> ${res.category_id.name}</small>
              <small><b>Brand:</b> ${res.brand_id.name}
          </small>
      </p>`,
      res.total,
      res.isReturn
        ? `<span class="badge bg-success">Yes</span>`
        : `<span class="badge bg-danger">No</span>`,
      `<div id="product-btn-${res._id}"></div>`,
    ])
    .draw(false);
  $(`#product-btn-${res._id}`).append(elem);
}
function addCartTableRow(res, productTable, cartTable) {
  //REMOVE CART BTN
  let removeElem = $(`
      <a class="action-icon"> <i class="mdi mdi-delete"></i></a>
  `);
  removeElem.click(function () {
    let data = res;

    cartTable.row($(this).parents("tr")).remove().draw();
    addProductTableRow(res, productTable, cartTable);

    //REMOVE PRODUCT FROM CART
    products = products.filter((product) => {
      return product.product_id != data._id;
    });
  });
  //CHANGE PRODUCT QUANTITY
  let qtyElem = $(`
    <input type="number" class="form-control" placeholder="Qty" value="1" style="width: 90px;">
  `);
  qtyElem.change(function () {
    const data = res;
    //INNPUT MIN AND MAX OF PRODUCT STOCKS
    if (this.value > data.total) {
      this.value = data.total;
    } else if (this.value < 1) {
      this.value = 1;
    }
    //UPDATE PRODUCT QUANTITY
    products.map((product) => {
      if (data._id == product.product_id) {
        product.qty = parseInt(this.value);
        //product.total = parseInt(this.value * data.price);
        return product;
      }
    });
    //DISPLAY TOTAL
    $(`#cart-total-${data._id}`).html(parseInt(data.price * this.value));
  });

  //DATE RETURN
  let inputDateReturn = $(`
    <input type="date" class="form-control" style="width: 120px;">
  `);
  inputDateReturn.change(function () {
    const data = res;
    //UPDATE DATE RETURN
    products.map((product) => {
      if (data._id == product.product_id) {
        product.returnDate = this.value;
        return product;
      }
    });
  });

  cartTable.row
    .add([
      `<img src="${res.img}" alt="contact-img" title="contact-img" class="rounded me-3" height="64" />
      <p class="m-0 d-inline-block align-middle font-16">
          <a href="apps-ecommerce-products-details.html" class="text-body">${res.name}</a>
          <br/>
          <small class="me-2"><b>Category:</b> ${res.category_id.name}</small>
              <small><b>Brand:</b> ${res.brand_id.name}
          </small>
      </p>`,
      res.total,
      `<div id="cart-date-return-${res._id}"></div>`,
      `<div id="cart-qty-${res._id}"></div>`,
      `<div id="cart-remove-${res._id}" style="width:40px"></div>`,
    ])
    .draw(false);
  $(`#cart-qty-${res._id}`).append(qtyElem);
  $(`#cart-remove-${res._id}`).append(removeElem);
  res.isReturn ? $(`#cart-date-return-${res._id}`).append(inputDateReturn) : "";
}
function dispalyEverySalesInTable(res, salesTable) {
  //REMOVE SALES BTN
  let removeSales = $(`
    <a class="action-icon"> <i class="mdi mdi-delete"></i></a>
  `);
  removeSales.click(function () {
    const data = res;
    delete_data("/client/product/remove/", data._id);
  });

  salesTable.row
    .add([
      `<img src="${res.product_id.img}" alt="contact-img" title="contact-img" class="rounded me-3" height="64" />
    <p class="m-0 d-inline-block align-middle font-16">
        <a href="apps-ecommerce-products-details.html" class="text-body">${res.product_id.name}</a>
        <br/>
        <small class="me-2"><b>Category:</b> ${res.product_id.category_id.name}</small>
            <small><b>Brand:</b> ${res.product_id.brand_id.name}
        </small>
     </p>`,
      moment(res.createdAt).format("MMM DD, YYYY"),
      res.qty,
      `<span class="badge bg-${
        res.product_id.isReturn ? "success" : "danger"
      }">${res.product_id.isReturn ? "Yes" : "No"}</span>`,
      res.returnDate ? moment(res.returnDate).format("MMM DD, YYYY") : "",
      `<span class="badge bg-${
        res.status == "accepted" ? "success" : "danger"
      }">${res.status}</span>`,
      `<div id="remove-${res._id}"></div>`,
    ])
    .draw(false)
    .node().id = res._id;
  if (res.status != "accepted") {
    $(`#remove-${res._id}`).append(removeSales);
  }
}
function appendRowSales(res, cartTable) {
  products.push({
    _id: res._id,
    qty: res.qty,
    returnDate: res.returnDate
      ? moment(res.returnDate).format("YYYY-DD-MM")
      : null,
  });
  //REMOVE CART BTN
  let removeElem = $(`
      <a class="action-icon"> <i class="mdi mdi-delete"></i></a>
  `);
  removeElem.click(function () {
    let data = res;
    cartTable.row($(this).parents("tr")).remove().draw();
    //REMOVE PRODUCT FROM CART
    products = products.map((product) => {
      if (product._id == data._id) {
        product.status = "cancel";
      }
      return product;
    });
  });
  //CHANGE PRODUCT QUANTITY
  let qtyElem = $(`
    <input type="number" class="form-control" placeholder="Qty" value="${res.qty}" style="width: 90px;">
  `);
  qtyElem.change(function () {
    const data = res;
    //INNPUT MIN AND MAX OF PRODUCT STOCKS
    if (this.value > data.total) {
      this.value = data.total;
    } else if (this.value < 1) {
      this.value = 1;
    }
    //UPDATE PRODUCT QUANTITY
    products.map((product) => {
      if (data._id == product._id) {
        product.qty = parseInt(this.value);
        //product.total = parseInt(this.value * data.price);
        return product;
      }
    });
    //DISPLAY TOTAL
    $(`#cart-total-${data._id}`).html(parseInt(data.price * this.value));
  });
  //DATE RETURN
  let inputDateReturn = $(`
    <input type="date" class="form-control" style="width: 120px;" value="${
      res.returnDate ? moment(res.returnDate).format("YYYY-MM-DD") : null
    }">
  `);
  inputDateReturn.change(function () {
    const data = res;
    //UPDATE DATE RETURN
    products.map((product) => {
      if (data._id == product._id) {
        product.returnDate = this.value;
        return product;
      }
    });
  });

  cartTable.row
    .add([
      `<img src="${res.img}" alt="contact-img" title="contact-img" class="rounded me-3" height="64" />
      <p class="m-0 d-inline-block align-middle font-16">
          <a href="apps-ecommerce-products-details.html" class="text-body">${res.name}</a>
          <br/>
          <small class="me-2"><b>Category:</b> ${res.category}</small>
              <small><b>Brand:</b> ${res.brand}
          </small>
      </p>`,
      res.stocks,
      `<div id="cart-qty-${res._id}"></div>`,
      `<div id="cart-date-return-${res._id}"></div>`,
      `<div id="cart-remove-${res._id}" style="width:40px"></div>`,
    ])
    .draw(false);
  $(`#cart-qty-${res._id}`).append(qtyElem);
  $(`#cart-remove-${res._id}`).append(removeElem);
  res.isReturn ? $(`#cart-date-return-${res._id}`).append(inputDateReturn) : "";
}
function appendAllSales(res, tableName, status, salesBtnName) {
  console.log(res);
  res.createdAtDate = moment(res.createdAt).format("MMM DD, YYYY");
  res.createdAtTime = moment(res.createdAt).format("HH:MM");
  let viewOrEdit = $(`
    <button type="button" class="btn btn-success btn-sm">
      <i class="mdi mdi-cart-outline"></i> ${salesBtnName}
    </button>
  `);
  viewOrEdit.click(function () {
    const data = res;
    rowId = res.userId;
    products = [];
    $("#modal-product-body").html("");
    $(`#modal-product`).modal("show");
    $("#data-datatable").DataTable().rows().remove();
    res.salesDb.map((r) => {
      appendRowSales(r, $("#data-datatable").DataTable());
    });
  });

  tableName.row
    .add([
      `<img src="${
        res.profile_img
      }" alt="contact-img" title="contact-img" class="rounded me-3" height="38"/>
      <p class="m-0 d-inline-block align-middle font-16">
      ${
        res.firstName ? res.firstName : res.email ? res.email : res.phoneNumber
      } ${res.lastName ? res.lastName : ""}
      </p>`,
      `${res.createdAtDate}<small class="text-muted"> ${res.createdAtTime}</small>`,

      `${res.note ? res.note : ""}`,
      `<span class="badge badge-${
        status == "pending" ? "warning" : "success"
      }-lighten p-1">${status}</span>`,
      `<div id="viewOrEdit-${res.userId}"></div>`,
    ])
    .draw(false)
    .node().id = res.userId;
  $(`#viewOrEdit-${res.userId}`).append(viewOrEdit);
}
function appendRowSalesReturn(res, cartTable) {
  products.push({
    _id: res._id,
    qty: res.qty,
    returnDate: res.returnDate
      ? moment(res.returnDate).format("YYYY-DD-MM")
      : null,
  });
  //REMOVE CART BTN
  let returnNow = $(`
      <button class="btn btn-success">
      <i class="mdi dripicons-return"/> Return item
      </button>
  `);
  returnNow.click(function () {
    const data = res;
    //ACCEPT THE RETURN ITEM
    acceptReturnItem(data);
  });
  //CHANGE PRODUCT QUANTITY
  let qtyElem = $(`
    <input type="number" class="form-control" placeholder="Qty" value="${res.qty}" style="width: 90px;" disabled>
  `);
  qtyElem.change(function () {
    const data = res;
    //INNPUT MIN AND MAX OF PRODUCT STOCKS
    if (this.value > data.total) {
      this.value = data.total;
    } else if (this.value < 1) {
      this.value = 1;
    }
    //UPDATE PRODUCT QUANTITY
    products.map((product) => {
      if (data._id == product._id) {
        product.qty = parseInt(this.value);
        //product.total = parseInt(this.value * data.price);
        return product;
      }
    });
    //DISPLAY TOTAL
    $(`#cart-total-${data._id}`).html(parseInt(data.price * this.value));
  });
  //DATE RETURN
  let inputDateReturn = $(`
    <input type="date" class="form-control" style="width: 125px;" value="${
      res.returnDate ? moment(res.returnDate).format("YYYY-MM-DD") : null
    }" disabled>
  `);
  inputDateReturn.change(function () {
    const data = res;
    //UPDATE DATE RETURN
    products.map((product) => {
      if (data._id == product._id) {
        product.returnDate = this.value;
        return product;
      }
    });
  });

  cartTable.row
    .add([
      `<img src="${res.img}" alt="contact-img" title="contact-img" class="rounded me-3" height="64" />
      <p class="m-0 d-inline-block align-middle font-16">
          <a href="apps-ecommerce-products-details.html" class="text-body">${res.name}</a>
          <br/>
          <small class="me-2"><b>Category:</b> ${res.category}</small>
              <small><b>Brand:</b> ${res.brand}
          </small>
      </p>`,
      `<div id="cart-qty-${res._id}"></div>`,
      `<div id="cart-date-return-${res._id}"></div>`,
      `<div id="cart-remove-${res._id}"></div>`,
    ])
    .draw(false);
  $(`#cart-qty-${res._id}`).append(qtyElem);
  $(`#cart-remove-${res._id}`).append(returnNow);
  res.isReturn ? $(`#cart-date-return-${res._id}`).append(inputDateReturn) : "";
}
function appendAllSalesToReturn(res, tableName, status, salesBtnName) {
  res.createdAtDate = moment(res.createdAt).format("MMM DD, YYYY");
  res.createdAtTime = moment(res.createdAt).format("HH:MM");
  let viewOrEdit = $(`
    <button type="button" class="btn btn-success btn-sm">
      <i class="mdi mdi-cart-outline"></i> ${salesBtnName}
    </button>
  `);
  viewOrEdit.click(function () {
    const data = res;
    rowId = res.userId;
    products = [];
    $("#modal-product-body").html("");
    $(`#modal-product`).modal("show");
    $("#data-datatable").DataTable().rows().remove();
    res.salesDb.map((r) => {
      appendRowSalesReturn(r, $("#data-datatable").DataTable());
    });
  });

  tableName.row
    .add([
      `<img src="${
        res.profile_img
      }" alt="contact-img" title="contact-img" class="rounded me-3" height="38"/>
      <p class="m-0 d-inline-block align-middle font-16">
      ${
        res.firstName ? res.firstName : res.email ? res.email : res.phoneNumber
      } ${res.lastName ? res.lastName : ""}
      </p>`,
      `${res.createdAtDate}<small class="text-muted"> ${res.createdAtTime}</small>`,
      `<span class="badge badge-${
        status == "pending" ? "warning" : "success"
      }-lighten p-1">${status}</span>`,
      `<div id="viewOrEdit-${res.userId}"></div>`,
    ])
    .draw(false)
    .node().id = res.userId;
  $(`#viewOrEdit-${res.userId}`).append(viewOrEdit);
}
function appendRowTopSales(res, tableName) {
  $(`#${tableName}`).append(`
  <tr>
  <td>
    <h5 class="font-14 my-1 fw-normal">
      ${res.name}
    </h5>
    <span class="text-muted font-13">Category: ${res.category} / Brand: ${res.brand}</span>
  </td>
  <td>
    <h5 class="font-14 my-1 fw-normal">₱${res.price}</h5>
    <span class="text-muted font-13">Price</span>
  </td>
  <td>
    <h5 class="font-14 my-1 fw-normal">${res.qty}</h5>
    <span class="text-muted font-13">Quantity</span>
  </td>
  <td>
    <h5 class="font-14 my-1 fw-normal">₱${res.subTotal}</h5>
    <span class="text-muted font-13">Amount</span>
  </td>
</tr>`);
}
/******************************************************
 * ******************* AJAX **********************
 * ****************************************************/

function checkOutProduct() {
  if (products == "") {
    return errorSweetAlert();
  } else {
    $.ajax({
      type: "POST",
      url: "/admin/checkout",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(products),
      success: function (res) {
        if (res.type == "danger") {
          return errorSweetAlert();
        }
        window.location.href =
          "/admin/dashboard?message=Successfully checkout.&alert=success";
      },
    }).fail(function (res) {
      console.log(res);
      errorSweetAlert();
    });
  }
}

function addToCart() {
  if (products == "") {
    return errorSweetAlert();
  } else {
    //add note every products
    products = products.map((r) => {
      r.note = $("#productNote").val();
      return r;
    });
    $.ajax({
      type: "POST",
      url: "/client/addToCart",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(products),
      success: function (res) {
        window.location.href =
          "/client/dashboard?message=Successfully add to cart.&alert=success";
      },
    }).fail(function (res) {
      console.log(res);
      errorSweetAlert();
    });
  }
}
function getOneProduct(endpoints, id) {
  $.ajax({
    type: "GET",
    url: endpoints + id,
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      $(".unitSpan").html(res.unit_id.name);
    },
  }).fail(function (res) {
    console.log(res);
    errorSweetAlert();
  });
}

//SWEET ALERT CONFIG
function errorSweetAlert() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
  });
}
function sweetAlertMixinConfig() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  return Toast;
}
//END
function delete_data(endpoints, _id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: endpoints + _id,
        dataType: "json",
        data: null,
        success: function (result) {
          //remove row in table
          if (result.status) {
            var table = $("#data-datatable").DataTable();
            table
              .row($(`#${_id}`))
              .remove()
              .draw();
          }
          //show alert message
          const Toast = sweetAlertMixinConfig();
          Toast.fire({
            icon: result.icon,
            title: result.message,
          });
        },
      }).fail(function (res) {
        console.log(res);
        errorSweetAlert();
      });
    }
  });
}

function acceptReturnItem(data) {
  Swal.fire({
    title: "Are you sure this item is return?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, accept it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: `/admin/accept-return-item/${data._id}`,
        dataType: "json",
        data: null,
        success: function (result) {
          //remove row in table
          if (result.type == "success") {
            window.location.href =
              "/admin/return-item?message=Successfully accepted.&alert=success";
          }
        },
      }).fail(function (res) {
        console.log(res);
        errorSweetAlert();
      });
    }
  });
}
