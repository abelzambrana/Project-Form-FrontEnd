const baseURLProductos = 'http://127.0.0.1:5000/api/productos/';  

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
    const mainContent = document.getElementById('content');
    mainContent.innerHTML = `
        <h2>Gestión de Productos</h2>
        <form id="form-producto">
            <input type="hidden" id="id" name="id">
            <input type="text" id="nombre" name="nombre" placeholder="Nombre">
            <textarea id="descripcion" name="descripcion" placeholder="Descripción"></textarea>
            <input type="number" id="precio" name="precio" placeholder="Precio">
            <input type="number" id="stock" name="stock" placeholder="Stock">
            <select id="id_categoria" name="id_categoria">
                <option value="Barrita cereal">Barrita de cereal</option>
                <option value="Granola">Granola</option>
                <option value="Otro">Otro</option>
            </select>
            <input type="text" id="imagen_url" name="imagen_url" placeholder="URL de Imagen">
            <button type="button" id="btn-save-producto">Guardar Producto</button>
            <button type="button" id="btn-update-producto" style="display: none;">Actualizar Producto</button>
            <button type="button" id="btn-cancelar">Cancelar</button>
        </form>
        <table id="tabla-productos">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Fecha de Creación</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tbody-table-productos">
                ${productos.map(producto => `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>${producto.categoria_id}</td>
                        <td>${producto.fecha_creacion ? new Date(producto.fecha_creacion).toLocaleDateString() : 'No disponible'}</td>
                        <td><img src="${producto.imagen_url}" alt="${producto.nombre}" style="width: 100px; height: auto;"></td>
                        <td>
                            <button class="btn-editar" data-id="${producto.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;








}    