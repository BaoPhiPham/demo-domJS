"use strict";
document.querySelector("form").addEventListener("submit", (event)=>{
    event.preventDefault();//chặn sự kiện reset trang khi submit
    const name = document.querySelector("#name").value;
    // Tạo ra đối tượng item:
    const item = {
        id: new Date().toISOString(),
        name: name.trim(), //xóa khoản cách thừa
    };
    // Hiển thị object item lên UI
    addItemToUI(item);
    // Lưu trữ item lên local storage:
    addItemToLS(item);
});

// addItemToUI: hàm nhận vào item và hiển thị lên UI:
    const addItemToUI = (item) => {
        const {name, id} = item;//destructuring chỉ dùng đc ở jS
        const newCard  = document.createElement("div");
        newCard.className = "card d-flex flex-row justify-content-between align-items-center p-2 mb-3";
        // truy cập nội dung của div có: inner/ouner html  và textContent
        newCard.innerHTML = `
            <span>${name}</span>
            <button data-id="${id}" class="btn btn-danger btn-sm btn-remove">Remove</button>
        `;
        document.querySelector(".list").appendChild(newCard);
    };

// Hàm getList: lấy danh sách các item từ local storage:
    const getList = () => {
        return JSON.parse(localStorage.getItem("list")) || [];
        // Ls có thể ko có chuỗi nào
    };

// addItemToLS:
    const addItemToLS = (item) => {
        const list = getList();//lấy ds từ ls về
        list.push(item);//nhét item vào đanh sách
        localStorage.setItem("list", JSON.stringify(list)); //lưu list dã nhét item lên lại ls
    };

// Hàm render tất cả item lên UI mỗi khi vào trang:
    const init = () => {
        const list = getList();//lấy ds từ ls về
        list.forEach((item) => {
            addItemToUI(item);
        });
    };
    init();

// 
    document.querySelector(".list").addEventListener("click", (event)=>{
        if(event.target.classList.contains("btn-remove")){
            const nameItem = event.target.previousElementSibling.textContent;
            const isConfirmed = confirm(`Bạn có chắc là muốn xóa Item: ${nameItem} không ?`);
            if(isConfirmed){
                //xóa trên UI trước:
                event.target.parentElement.remove();
                // xóa trên Local Storage:
                const idRemove = event.target.dataset.id;//lấy id cẩn remove từ data id của nút xóa
                                // khi tk user đã confirm là xóa thì mới lấy id
                removeItemFromLS(idRemove);
            }
        };
    });

// Hàm nhận vào id từ btn-remove đã nhận, dùng id đó tìm cà xáo item trong ls
    const removeItemFromLS = (idRemove => {
        let list = getList();//lấy ds item về
        list = list.filter((item)=> item.id != idRemove);//lọc những tk id khác id cần xóa
        localStorage.setItem("list", JSON.stringify(list));//lưu list đã cập nhật lên lại
    });

//Remve ALL:
    document.querySelector("#btn-remove-all").addEventListener("click", (event) => {
        const isConfirmed = confirm(`Bạn có chắc là muốn xóa hết Item không ?`);
        if(isConfirmed){
            document.querySelector(".list").innerHTML = "";
            localStorage.removeItem("list");
        };
    });

// chức năng filter:
    document.querySelector("#filter").addEventListener("keyup", (event)=>{
        let  inputValue = event.target.value;//lấy value từ ô input điễn ra sự kiện
        let list = getList();//1 lần gõ là tốn tiền
        list = list.filter((item)=> item.name.includes(inputValue));
        //xóa các item trong list để render list vừa lọc:
        document.querySelector(".list").innerHTML = "";
        list.forEach((item)=>{
            addItemToUI(item);
        });
        // => Thực tế cách này không ngon vừa hiêụ xuất chậm vừa tốn tiền, học để biết
    });