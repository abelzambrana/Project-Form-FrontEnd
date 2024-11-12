const baseURLProductos = 'http://127.0.0.1:5000/api/producto/';  

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); // Cargar productos por defecto al iniciar la página
});

async function cargarProductos() {
    try {
        const response = await fetch(baseURLProductos);
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productos) {
    const mainContent = document.getElementById('content');   // Cambio id_producto por id
    mainContent.innerHTML = `
        <h2>Gestión de Productos</h2>
        <form id="form-producto">
            <input type="hidden" id="id" name="id">

            <input type="text" id="nombre" name="nombre" placeholder="Nombre">

            <input type="text" id="fabricante" name="fabricante" placeholder="Fabricante">

            <input type="text" id="codigo_barra" name="codigo_barra" placeholder="Codigo de barra">

            <input type="date" id="due_date" name="due_date" placeholder="Fecha de vencimiento">

            <input type="number" id="sale_price" name="sale_price" placeholder="Precio de venta">

            <input type="number" id="cost_price" name="cost_price" placeholder="Precio de costo">

            <input type="number" id="stock" name="stock" placeholder="Stock">

            <select id="categoria" name="categoria">
                <option value="Galletas">Galletas</option>
                <option value="Fideo">Fideo</option>
                <option value="Condimentos">Condimentos</option>
                <option value="Especies">Especies</option>
                <option value="Dulces">Dulces</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Otro">Otro</option>
            </select>

            <input type="text" id="banner" name="banner" placeholder="URL de banner">

            <button type="button" id="btn-save-producto">Guardar Producto</button>

            <button type="button" id="btn-update-producto" style="display: none;">Actualizar Producto</button>

            <button type="button" id="btn-cancelar">Cancelar</button>
        </form>

        <table id="tabla-productos">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fabricante</th>
                    <th>Codigo de barra</th>
                    <th>Fecha de vencimiento</th>
                    <th>Precio de venta</th>
                    <th>Precio de costo</th>
                    <th>Ganancia</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Banner</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tbody-table-productos">
                ${productos.map(producto => `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.fabricante}</td>
                        <td>${producto.codigo_barra}</td>
                        <td>${producto.due_date}</td>
                        <td>${producto.sale_price}</td>
                        <td>${producto.cost_price}</td>
                        <td>${producto.ganancia}</td>
                        <td>${producto.stock}</td>
                        <td>${producto.categoria}</td>
                        <td><img src="${producto.banner}" alt="${producto.nombre}" style="width: 100px; height: auto;"></td>
                        <td>
                            <button class="btn-editar" data-id="${producto.id_producto}">Editar</button>
                            <button class="btn-eliminar" data-id="${producto.id_producto}">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;                                                        // Cambio id_producto por id
    //<button class="btn-editar" data-id="${producto.id}">Editar</button>
    //<button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
    
    //<button class="btn-editar" onclick='actualizarProducto(${producto.id_producto})'>Editar</button>
    //<button class="btn-eliminar" onclick='eliminarProducto(${producto.id_producto})'>Eliminar</button>

    // Configurar eventos para los botones de editar y eliminar
    const btnEditar = mainContent.querySelectorAll('.btn-editar');
    const btnEliminar = mainContent.querySelectorAll('.btn-eliminar');

    btnEditar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idProducto = btn.dataset.id; // Cambio id_producto por id
            const producto = await obtenerProducto(idProducto);
            llenarFormularioProducto(producto);
        });
    });


    btnEliminar.forEach(btn => {
        btn.addEventListener('click', async () => {
            const idProducto = btn.dataset.id; // Cambio id_producto por id
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                await eliminarProducto(idProducto);
                cargarProductos();
            }
        });
    });

    // Configurar evento para el botón de guardar producto
    const btnGuardarProducto = document.getElementById('btn-save-producto');
    if (btnGuardarProducto) {
        btnGuardarProducto.addEventListener('click', async () => {
            await guardarProducto();
        });
    }

    // Configurar evento para el botón de actualizar producto
    const btnActualizarProducto = document.getElementById('btn-update-producto');
    if (btnActualizarProducto) {
        btnActualizarProducto.addEventListener('click', async () => {
            await actualizarProducto();
        });
    }

    // Configurar evento para el botón de cancelar
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetFormularioProducto();
        });
    }

}    

async function obtenerProducto(id) {
    try {
        const response = await fetch(`${baseURLProductos}${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el producto');
        }
        const producto = await response.json();
        return producto;
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
    }
}

async function guardarProducto() {
    const formProducto = document.getElementById('form-producto');
    const formData = new FormData(formProducto);
    const data = {
        nombre: formData.get('nombre'),
        fabricante: formData.get('fabricante'),
        codigo_barra: formData.get('codigo_barra'),
        due_date: formData.get('due_date'),
        sale_price: formData.get('sale_price'),
        cost_price: formData.get('cost_price'),
        ganancia: formData.get('ganancia'),
        stock: formData.get('stock'),
        categoria: formData.get('categoria'),
        //id_categoria: formData.get('id_categoria'),
        banner: formData.get('banner')
    };

    try {
        const response = await fetch(baseURLProductos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }
        resetFormularioProducto();
        cargarProductos();
    } catch (error) {
        console.error('Error al guardar producto:', error);
    }
}


async function actualizarProducto() {
    const formProducto = document.getElementById('form-producto');
    const formData = new FormData(formProducto);
    const idProducto = formData.get('id');   // Cambio id_producto por id
    const data = {
        nombre: formData.get('nombre'),
        fabricante: formData.get('fabricante'),
        codigo_barra: formData.get('codigo_barra'),
        due_date: formData.get('due_date'),
        sale_price: formData.get('sale_price'),
        cost_price: formData.get('cost_price'),
        ganancia: formData.get('ganancia'),
        stock: formData.get('stock'),
        categoria: formData.get('categoria'),
        //id_categoria: formData.get('id_categoria'),
        banner: formData.get('banner')
    };

    try {
        const response = await fetch(`${baseURLProductos}${idProducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }
        resetFormularioProducto();
        cargarProductos();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
}

async function eliminarProducto(id) {
    try {
        const response = await fetch(`${baseURLProductos}${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        cargarProductos();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

function llenarFormularioProducto(producto) {
    const formProducto = document.getElementById('form-producto');
    formProducto.querySelector('#id').value = producto.id_producto;   // Cambio id_producto por id
    formProducto.querySelector('#nombre').value = producto.nombre;
    formProducto.querySelector('#fabricante').value = producto.fabricante;
    formProducto.querySelector('#codigo_barra').value = producto.codigo_barra;
    formProducto.querySelector('#due_date').value = producto.due_date;
    formProducto.querySelector('#sale_price').value = producto.sale_price;
    formProducto.querySelector('#cost_price').value = producto.cost_price;
    formProducto.querySelector('#ganancia').value = producto.ganancia;
    formProducto.querySelector('#stock').value = producto.stock;
    //formProducto.querySelector('#id_categoria').value = producto.id_categoria;
    formProducto.querySelector('#categoria').value = producto.categoria;
    formProducto.querySelector('#banner').value = producto.banner;

    // Mostrar botón de actualizar y ocultar el de guardar
    formProducto.querySelector('#btn-save-producto').style.display = 'none';
    formProducto.querySelector('#btn-update-producto').style.display = 'inline-block';
}

function resetFormularioProducto() {
    const formProducto = document.getElementById('form-producto');
    formProducto.reset();

    // Ocultar botón de actualizar y mostrar el de guardar
    formProducto.querySelector('#btn-save-producto').style.display = 'inline-block';
    formProducto.querySelector('#btn-update-producto').style.display = 'none';
}