let encryptstate=0;
let stckhist="";
//let stackHistory="";
// Define the alphabet for Playfair cipher
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

// Function to generate Playfair matrix from the key
function generateMatrix(key) {
    key = key.toUpperCase().replace(/J/g, "I"); // Replace J with I
    let matrix = [];
    let keySet = new Set();

    // Initialize a 5x5 matrix with empty arrays
    for (let i = 0; i < 5; i++) {
        matrix.push([]);
    }
    
    for (let char of key) {
        if (!keySet.has(char) && alphabet.includes(char)) {
            keySet.add(char);
            for (let i = 0; i < 5; i++) {
                if (matrix[i].length < 5) {
                    matrix[i].push(char); // Add the character to the first empty slot in the row
                    break;
                }
            }
        }
    }
    
    // Add remaining alphabet characters to the matrix
    for (let char of alphabet) {
        if (!keySet.has(char)) {
            for (let i = 0; i < 5; i++) {
                if (matrix[i].length < 5) {
                    matrix[i].push(char); // Add the character to the first empty slot in the row
                    break;
                }
            }
        }
    }
    
    return matrix;
}

function findIndices(matrix, char) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (matrix[i][j] === char) {
                return [i, j];
            }
        }
    }
}

function visualizeGrid(matrix,a,b,c,d) {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            if(((i===c[0] && j===c[1]) || (i===d[0] && j===d[1])) && ((i===a[0] && j===a[1])||(i===b[0] && j===b[1]))){
                gridItem.style.backgroundColor="orange";
            }
            else if((i===a[0] && j===a[1])||(i===b[0] && j===b[1])){
                gridItem.style.backgroundColor="yellow";
            }
            else if((i===c[0] && j===c[1])||(i===d[0] && j===d[1])){
                gridItem.style.backgroundColor="red";
            }
            gridItem.textContent = matrix[i][j];
            gridContainer.appendChild(gridItem);
        }
    }
}


function encrypt() {
    encryptstate=1;
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    let key = document.getElementById("key").value;
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let matrix = generateMatrix(key);
    let result = "";
    let ciphertext = "";
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    // Implement Playfair encryption logic
    for (let i = 0; i < plaintext.length; i += 2) {
        let pair = plaintext.slice(i, i + 2);
        let indices1 = findIndices(matrix, pair[0]);
        let indices2 = findIndices(matrix, pair[1]);
       
        if (indices1 && indices2) {
            if (indices1[0] === indices2[0]) {
                ciphertext += matrix[indices1[0]][(indices1[1] + 1) % 5];
                ciphertext += matrix[indices2[0]][(indices2[1] + 1) % 5];
            } 
            else if (indices1[1] === indices2[1]) {
                ciphertext += matrix[(indices1[0] + 1) % 5][indices1[1]];
                ciphertext += matrix[(indices2[0] + 1) % 5][indices2[1]];
            } 
            else {
                ciphertext += matrix[indices1[0]][indices2[1]];
                ciphertext += matrix[indices2[0]][indices1[1]];
            }
        }
    }
    stckhist="";
    stckhist+=ciphertext;
    result = "Encrypted Text: " + ciphertext;
    document.getElementById("result").innerText = result;
}


function decrypt() {
    encryptstate=0;
    stckhist="";
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    let key = document.getElementById("key").value;
    let matrix = generateMatrix(key);
    let result = "";
    let decryptedText = "";
    // Implement Playfair decryption logic
    for (let i = 0; i < plaintext.length; i += 2) {
        let pair = plaintext.slice(i, i + 2);
        let indices1 = findIndices(matrix, pair[0]);
        let indices2 = findIndices(matrix, pair[1]);
        if (indices1 && indices2) {
            if (indices1[0] === indices2[0]) {
                decryptedText += matrix[indices1[0]][(indices1[1] - 1 + 5) % 5];
                decryptedText += matrix[indices2[0]][(indices2[1] - 1 + 5) % 5];
            } else if (indices1[1] === indices2[1]) {
                decryptedText += matrix[(indices1[0] - 1 + 5) % 5][indices1[1]];
                decryptedText += matrix[(indices2[0] - 1 + 5) % 5][indices2[1]];
            } else {
                decryptedText += matrix[indices1[0]][indices2[1]];
                decryptedText += matrix[indices2[0]][indices1[1]];
            }
        }
    }
    stckhist+=decryptedText;
    result = "Decrypted Text: " + decryptedText;
    document.getElementById("result").innerText = result;
    
}

let currentStepIndex = 0;
function viewSteps(){
    if(encryptstate==1){
        viewStepsE();
    }
    else{
       viewStepsD();
    }
}
function viewStepsE() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    visualizeStepsE(currentStepIndex);
}
function viewStepsD() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    visualizeStepsD(currentStepIndex);
}

// Close Modal Functionality
// Function to close the modal overlay
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}



// Function to visualize encryption/decryption steps
function visualizeStepsE(currentStepIndex) {
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    let ciphertext = document.getElementById("result").innerText.replace('Encrypted Text: ', '');    
    let key = document.getElementById("key").value.toUpperCase().replace(replaceletter, replacedletter);
    let matrix = generateMatrix(key);
    let i=currentStepIndex;
    let temptext1=plaintext.slice(i,i+2);
    let temptext2=ciphertext.slice(i,i+2);
    let a=findIndices(matrix,temptext1[0]); 
    let b=findIndices(matrix,temptext1[1]);
    let c=findIndices(matrix,temptext2[0]); 
    let d=findIndices(matrix,temptext2[1]);
    visualizeGrid(matrix,a,b,c,d);
    let stepinfo="Step "+((currentStepIndex/2)+1)+" :";
    document.getElementById("stepinfo").innerText = stepinfo;
    let changeinfo="\nThe changes observed are from \n\t"+temptext1[0]+" ==> "+temptext2[0]+"\n\t"+temptext1[1]+" ==> "+temptext2[1]
    document.getElementById("changeinfo").innerText = changeinfo;

}

function visualizeStepsD(currentStepIndex) {
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    let ciphertext = document.getElementById("result").innerText.replace('Decrypted Text: ', '');    
    let key = document.getElementById("key").value.toUpperCase().replace(replaceletter, replacedletter);
    let matrix = generateMatrix(key);
    let i=currentStepIndex;
    let temptext1=plaintext.slice(i,i+2);
    let temptext2=ciphertext.slice(i,i+2);
    let a=findIndices(matrix,temptext1[0]); 
    let b=findIndices(matrix,temptext1[1]);
    let c=findIndices(matrix,temptext2[0]); 
    let d=findIndices(matrix,temptext2[1]);
    visualizeGrid(matrix,a,b,c,d);
    let stepinfo="Step "+((i/2)+1);
    document.getElementById("stepinfo").innerText = stepinfo;
    let changeinfo="\nThe changes observed are from \n\t"+temptext1[0]+" ==> "+temptext2[0]+"\n\t"+temptext1[1]+" ==> "+temptext2[1]
    document.getElementById("changeinfo").innerText = changeinfo;
}
function prevStep(){
    if(encryptstate==1){
        prevStepE();
    }
    else{
        prevStepD();
    }
}
function nextStep(){
    if(encryptstate==1){
        nextStepE();
    }
    else{
        nextStepD();
    }
}
// Function to navigate to the previous step
function prevStepE() {
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    if (currentStepIndex > 0) {
        currentStepIndex-=2;
        visualizeStepsE(currentStepIndex);
    }
    else{
        currentStepIndex=plaintext.length-2;
        visualizeStepsE(currentStepIndex);
    }
}
function prevStepD() {
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    if (currentStepIndex > 0) {
        currentStepIndex-=2;
        visualizeStepsD(currentStepIndex);
    }
    else{
        currentStepIndex=plaintext.length-2;
        visualizeStepsD(currentStepIndex);
    }
}

// Function to navigate to the next step
function nextStepD() {
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    if (currentStepIndex < plaintext.length-2) {
        currentStepIndex+=2;
        visualizeStepsD(currentStepIndex);
    }
    else{
        currentStepIndex=0;
        visualizeStepsD(currentStepIndex);
    }
}
function nextStepE() {
    let placeholderchar = document.getElementById("plchldva").value.toUpperCase();
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    if(plaintext.length%2 !=0){
        plaintext+=placeholderchar;
    }
    if (currentStepIndex < plaintext.length-2) {
        currentStepIndex+=2;
        visualizeStepsE(currentStepIndex);
    }
    else{
        currentStepIndex=0;
        visualizeStepsE(currentStepIndex);
    }
}
function goToStep(){
    if(encryptstate==1){
        goToStepE();
    }
    else{
        goToStepD();
    }
}
function goToStepE() {
    let userinput=document.getElementById("stepnumber").value;
    visualizeStepsE((userinput-1)*2);

}
function goToStepD() {
    let userinput=document.getElementById("stepnumber").value;
    visualizeStepsD((userinput-1)*2);
}

function viewHistory(){
    let replaceletter=document.getElementById("replacelet").value.toUpperCase();
    let replacedletter=document.getElementById("replacedlet").value.toUpperCase();
    let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(replaceletter, replacedletter).replace(/\s/g, '');
    const contentDiv = document.getElementById("contentDiv");
    const modal = document.getElementById("modal2");
    modal.style.display = "flex";
    stackHistory=plaintext+" -- "+stckhist;
    const paragraph = document.createElement("p");
    paragraph.textContent = stackHistory;
    contentDiv.appendChild(paragraph);
}

function closeModal2() {
    const modal = document.getElementById("modal2");
    modal.style.display = "none";
}