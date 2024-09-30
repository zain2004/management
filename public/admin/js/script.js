//Bộ lọc trạng thái
const boxFilter = document.querySelector("[box-filter]");
if (boxFilter) {
    let url = new URL(location.href); // Nhân bản url
    boxFilter.addEventListener("change", () => {
        const value = boxFilter.value;
        if (value) {
            url.searchParams.set("status", value);
        } else {
            url.searchParams.delete("status");
        }
        location.href = url.href;
    });
    const currentStatus = url.searchParams.get("status");
    if (currentStatus) {
        boxFilter.value = currentStatus;
    }
}

//Tìm kiếm
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
    let url = new URL(location.href);
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = formSearch.keyword.value;
        if (value) {
            url.searchParams.set("keyword", value);
        } else {
            url.searchParams.delete("keyword");
        }
        location.href = url.href;
    });
    const currentKeyword = url.searchParams.get("keyword");
    if (currentKeyword) {
        formSearch.keyword.value = currentKeyword;
    }
}
//Hết tìm kiếm

//Phân trang
const pageLink = document.querySelectorAll(".page-link");
if (pageLink.length > 0) {
    let url = new URL(location.href);
    pageLink.forEach((page) => {
        page.addEventListener("click", () => {
            const value = parseInt(page.getAttribute("button-pagination"));
            if (value > 1) {
                url.searchParams.set("page", value);
            } else {
                url.searchParams.delete("page");
            }
            location.href = url.href;

        });
    });
    const currentPage = url.searchParams.get("page") || 1;
    const currentButton = document.querySelector(`[button-pagination="${currentPage}"]`);

    if (currentPage) {
        currentButton.parentNode.classList.add("active");
    }
}
//Hết phân trang

//Thay đổi trạng thái
const listButtonStatus = document.querySelectorAll("[changed-status]");
if (listButtonStatus.length > 0)
    listButtonStatus.forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.getAttribute("id-item");
            const changedStatus = button.getAttribute("changed-status");
            const dataPath = button.getAttribute("data-path");
            const data = {
                id: id,
                status: changedStatus
            };
            const require = await fetch(dataPath, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code) {
                        location.reload();
                    }
                })
        });
    });
//Hết thay đổi trạng thái

//Thay đổi trạng thái nhiều sản phầm
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti)
    formChangeMulti.addEventListener("submit", async (event) => {
        event.preventDefault();
        const listCheckedBox = document.querySelectorAll("[checkbox]:checked");
        const ids = [];
        const changedStatus = formChangeMulti.status.value;
        const path = formChangeMulti.getAttribute("data-path");
        listCheckedBox.forEach((checkedBox) => {
            ids.push(checkedBox.getAttribute("input-change"));
        })
        const data = {
            ids: ids,
            status: changedStatus
        };
        const require = await fetch(path, {
            headers: {
                "Content-type": "application/json"
            },
            method: "PATCH",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code) {
                    location.reload();
                }
            })
    });

//Hết thay đổi trạng thái nhiều sản phẩm

//Xóa mềm sản phẩm
const listDeletedButton = document.querySelectorAll("[delete-button]");
if (listDeletedButton.length > 0)
    listDeletedButton.forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.getAttribute("id-item");
            const path = button.getAttribute("data-path");
            const require = await fetch(path, {
                headers: {
                    "Content-type": "application/json",
                },
                method: "PATCH",
                body: JSON.stringify({
                    id: id
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code) {
                        location.reload();
                    }
                })
        })
    });
//Hết xóa mềm sản phẩm

//Thay đổi vị trí
const listChangPosition = document.querySelectorAll("[input-position]");
if (listChangPosition.length > 0)
    listChangPosition.forEach((input) => {
        input.addEventListener("change", async () => {
            const id = input.getAttribute("item-id");
            const position = input.value;
            const path = input.getAttribute("data-path");
            const data = {
                id: id,
                position: position
            };
            const request = await fetch(path, {
                headers: {
                    "Content-type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code) {
                        location.reload();
                    }
                })
        });
    });

//Hết thay đổi vị trí

//Sắp xếp sản phẩm
// Để đó để lm thêm mong muốn là trong phần sản phẩm admin vẫn có thể thay sắp xếp theo mong muốn
//Hết sắp xếp sản phẩm

//alert-message
const listAlertMessage = document.querySelectorAll("[alert-message]");
if (listAlertMessage.length > 0)
    listAlertMessage.forEach((alertMessage) => {
        setTimeout(() => {
            alertMessage.style.display = "none";
        }, 3000);
    });
//END alert-message

//Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if (file)
            uploadImagePreview.src = URL.createObjectURL(file);
    });
}
//End preview ảnh