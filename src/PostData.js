export function PostData(type, userData) {
	let BaseURL = 'http://localhost/photobook-api/photobook-api.php';
 return new Promise((resolve, reject) =>{
 fetch(BaseURL+type, {
method: 'GET',
body: JSON.stringify(userData)
})
.then((response) => response.json())
.then((res) => {
 resolve(res);
})
.catch((error) => {
 reject(error);
});
});
}