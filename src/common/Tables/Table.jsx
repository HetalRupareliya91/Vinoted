import classNames from "classnames";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Rating } from "primereact/rating";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Loader from "../../common/Loader/Loader";
import Snackbar from "../../common/Snackbar/Snackbar";
import http from "../../config/http";
import "./_table.scss";

class Table extends Component {
  emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,

    rating: 0,
    inventoryStatus: "INSTOCK",
  };

  constructor(props) {
    super(props);

    this.state = {
      maincolum: [],
      products: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: this.emptyProduct,
      selectedProducts: null,
      submitted: false,
      globalFilter: null,
      loader: false,
      outer_bar: false,
      open: false,
      snackbar: {
        message: "",
        status: "",
      },
    };
  }

  componentDidMount() {
    this.dataRefresh();
  }

  dataRefresh = () => {
    let col_array = [];
    this.props.columns.forEach((element, key) => {
      col_array.push(
        <Column
          key={key}
          field={element.field}
          header={element.headerName}
          sortable
        ></Column>
      );
    });
    let stateNew = { ...this.state };
    http.get("supplier/" + this.props.resource).then((response) => {
      stateNew.products = response.data.data.page.data;
      stateNew.maincolum = col_array;
      if (this.props.resource === "events") {
        response.data.data.page.data.forEach((element, key) => {
          response.data.data.page.data[key].state =
            element.city + ", " + element.state;
        });
      }
      this.setState(stateNew);
    });
  };

  // formatCurrency(value) {
  //   return value.toLocaleString("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   });
  // }

  openNew = () => {
    this.setState({
      product: this.emptyProduct,
      submitted: false,
      productDialog: true,
    });
  };

  hideDialog = () => {
    this.setState({
      submitted: false,
      productDialog: false,
    });
  };

  hideDeleteProductDialog = () => {
    this.setState({ deleteProductDialog: false });
  };

  hideDeleteProductsDialog = () => {
    this.setState({ deleteProductsDialog: false });
  };

  saveProduct = () => {
    let state = { submitted: true };

    if (this.state.product.name.trim()) {
      let products = [...this.state.products];
      let product = { ...this.state.product };
      if (this.state.product.id) {
        const index = this.findIndexById(this.state.product.id);

        products[index] = product;
        this.toast.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        product.id = this.createId();
        product.image = "product-placeholder.svg";
        products.push(product);
        this.toast.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      state = {
        ...state,
        products,
        productDialog: false,
        product: this.emptyProduct,
      };
    }

    this.setState(state);
  };

  editProduct = (product) => {
    console.log(product);
    this.props.history.push("/edit-event/" + product.id);
    // this.setState({
    //   product: { ...product },
    //   productDialog: true,
    // });
  };

  confirmDeleteProduct(product) {
    if (this.state.outer_bar === true) {
      this.setState({ outer_bar: false });
    }
    this.setState({ loader: true });
    http.delete("supplier/events/" + product.id).then((response) => {
      if (response.code === 200) {
        let stateNew = { ...this.state };
        stateNew.outer_bar = true;
        stateNew.open = true;
        stateNew.loader = false;
        stateNew.deleteProductDialog = false;
        stateNew.snackbar.message = response.data.message;
        stateNew.snackbar.status = "success";
        stateNew.displayResponsive = false;
        this.setState(stateNew);
        this.dataRefresh();
      }
    });
    this.setState({
      product,
    });
  }

  deleteProduct = () => {
    if (this.state.outer_bar === true) {
      this.setState({ outer_bar: false });
    }
    this.setState({ loader: true });
    http
      .delete("supplier/" + this.props.resource + "/" + this.state.product.id)
      .then((response) => {
        if (response.code === 200) {
          console.log("response", response);
          let stateNew = { ...this.state };
          stateNew.outer_bar = true;
          stateNew.open = true;
          stateNew.loader = false;
          stateNew.deleteProductDialog = false;
          stateNew.snackbar.message = response.data.message;
          stateNew.snackbar.status = "success";
          this.setState(stateNew);
        }
      });
  };

  findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < this.state.products.length; i++) {
      if (this.state.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  exportCSV = () => {
    this.dt.exportCSV();
  };

  confirmDeleteSelected = () => {
    this.setState({ deleteProductsDialog: true });
  };

  deleteSelectedProducts = () => {
    let products = this.state.products.filter(
      (val) => !this.state.selectedProducts.includes(val)
    );
    this.setState({
      products,
      deleteProductsDialog: false,
      selectedProducts: null,
    });
    this.toast.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  onCategoryChange = (e) => {
    let product = { ...this.state.product };
    product["category"] = e.value;
    this.setState({ product });
  };

  onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let product = { ...this.state.product };
    product[`${name}`] = val;

    this.setState({ product });
  };

  onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let product = { ...this.state.product };
    product[`${name}`] = val;

    this.setState({ product });
  };

  leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <h5 className="p-m-0 table-header">
          {this.props.tablename} Details{" "}
          {this.props.tablename === "Sommeliers"
            ? localStorage.getItem("en")
            : ""}
        </h5>
        {/* <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={this.openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={this.confirmDeleteSelected}
          disabled={
            !this.state.selectedProducts || !this.state.selectedProducts.length
          }
        /> */}
      </React.Fragment>
    );
  };

  rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="p-mr-2 p-d-inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={this.exportCSV}
        /> */}
      </React.Fragment>
    );
  };

  imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`showcase/demo/images/product/${rowData.image}`}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        alt={rowData.image}
        className="product-image"
      />
    );
  };

  // priceBodyTemplate(rowData) {
  //   return this.formatCurrency(rowData.price);
  // }

  ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  // statusBodyTemplate(rowData) {
  //   return (
  //     <span
  //       className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
  //     >
  //       {rowData.inventoryStatus}
  //     </span>
  //   );
  // }

  actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {this.props.resource === "events" && (
          <React.Fragment>
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success p-mr-2 edit-icon-table"
              onClick={() => this.editProduct(rowData)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-warning delete-icon-table"
              onClick={() => this.confirmDeleteProduct(rowData)}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  render() {
    // const header = (
    //   <div className="table-header">
    //     <h5 className="p-m-0">Manage {this.props.tablename}</h5>
    //     <span className="p-input-icon-left">
    //       <i className="pi pi-search" />
    //       <InputText
    //         type="search"
    //         onInput={(e) => this.setState({ globalFilter: e.target.value })}
    //         placeholder="Search..."
    //       />
    //     </span>
    //   </div>
    // );
    const productDialogFooter = (
      <React.Fragment>
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-text"
          onClick={this.hideDialog}
        />
        <Button
          label="Save"
          icon="pi pi-check"
          className="p-button-text"
          onClick={this.saveProduct}
        />
      </React.Fragment>
    );
    const deleteProductDialogFooter = (
      <React.Fragment>
        <Button
          label="No"
          icon="pi pi-times"
          className="p-button-text"
          onClick={this.hideDeleteProductDialog}
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          className="p-button-text"
          onClick={this.deleteProduct}
        />
      </React.Fragment>
    );
    const deleteProductsDialogFooter = (
      <React.Fragment>
        <Button
          label="No"
          icon="pi pi-times"
          className="p-button-text"
          onClick={this.hideDeleteProductsDialog}
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          className="p-button-text"
          onClick={this.deleteSelectedProducts}
        />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {this.state.loader && <Loader />}
        {this.state.outer_bar && (
          <Snackbar open={this.state.open} message={this.state.snackbar} />
        )}
        <div className="datatable-crud-demo">
          <Toast ref={(el) => (this.toast = el)} />

          <div className="table-card">
            <Toolbar
              className="p-mb-4"
              left={this.leftToolbarTemplate}
              right={this.rightToolbarTemplate}
            ></Toolbar>
            <div className="datatable-responsive-demo">
              <div className="card table-second-card">
                <DataTable
                  ref={(el) => (this.dt = el)}
                  value={this.state.products}
                  selection={this.state.selectedProducts}
                  onSelectionChange={(e) =>
                    this.setState({ selectedProducts: e.value })
                  }
                  dataKey="id"
                  paginator
                  rows={this.props.resource === "events" ? 10 : 10}
                  rowsPerPageOptions={
                    this.props.resource === "events" ? [] : [5, 10, 25]
                  }
                  paginatorTemplate={
                    this.props.resource === "events"
                      ? ""
                      : "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  }
                  className="p-datatable-responsive-demo"
                  currentPageReportTemplate={
                    "Showing {first} to {last} of {totalRecords} data"
                  }
                  globalFilter={this.state.globalFilter}
                  // header={header}
                >
                  {this.state.maincolum}

                  {/* <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column> */}
                  {/* <Column field="code" header="Code" sortable></Column>
            <Column field="name" header="Name" sortable></Column>

            <Column
              field="price"
              header="Price"
              body={this.priceBodyTemplate}
              sortable
            ></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column
              field="rating"
              header="Reviews"
              body={this.ratingBodyTemplate}
              sortable
            ></Column>
            <Column
              field="inventoryStatus"
              header="Status"
              body={this.statusBodyTemplate}
              sortable
            ></Column> */}
                  <Column
                    body={
                      this.props.resource === "events"
                        ? this.actionBodyTemplate
                        : ""
                    }
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>

          <Dialog
            visible={this.state.productDialog}
            style={{ width: "450px" }}
            header="Product Details"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={this.hideDialog}
          >
            {this.state.product.image && (
              <img
                src={`showcase/demo/images/product/${this.state.product.image}`}
                onError={(e) =>
                  (e.target.src =
                    "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                }
                alt={this.state.product.image}
                className="product-image"
              />
            )}
            <div className="p-field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={this.state.product.name}
                onChange={(e) => this.onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": this.state.submitted && !this.state.product.name,
                })}
              />
              {this.state.submitted && !this.state.product.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>
            <div className="p-field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={this.state.product.description}
                onChange={(e) => this.onInputChange(e, "description")}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="p-field">
              <label className="p-mb-3">Category</label>
              <div className="p-formgrid p-grid">
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category1"
                    name="category"
                    value="Accessories"
                    onChange={this.onCategoryChange}
                    checked={this.state.product.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={this.onCategoryChange}
                    checked={this.state.product.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={this.onCategoryChange}
                    checked={this.state.product.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={this.onCategoryChange}
                    checked={this.state.product.category === "Fitness"}
                  />
                  <label htmlFor="category4">Fitness</label>
                </div>
              </div>
            </div>

            <div className="p-formgrid p-grid">
              <div className="p-field p-col">
                <label htmlFor="price">Price</label>
                <InputNumber
                  id="price"
                  value={this.state.product.price}
                  onValueChange={(e) => this.onInputNumberChange(e, "price")}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              <div className="p-field p-col">
                <label htmlFor="quantity">Quantity</label>
                <InputNumber
                  id="quantity"
                  value={this.state.product.quantity}
                  onValueChange={(e) => this.onInputNumberChange(e, "quantity")}
                  integeronly
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={this.state.deleteProductDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={this.hideDeleteProductDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              {this.state.product && (
                <span>
                  Are you sure you want to delete{" "}
                  <b>{this.state.product.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={this.state.deleteProductsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={this.hideDeleteProductsDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              {this.state.product && (
                <span>
                  Are you sure you want to delete the selected products?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Table);
