'use client';

import { useState, useEffect } from 'react';

interface Ondulado {
  id: string;
  nome: string;
  fornecedor: string;
  largura: number;
  altura: number;
  gramatura: number;
  tipoOnda: string;
  quantidade: number;
  custoFolha: number;
  usoDestinado: string;
}

export default function Home() {
  const [ondulados, setOndulados] = useState<Ondulado[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Ondulado, 'id'>>({
    nome: '',
    fornecedor: 'MICROPACK',
    largura: 0,
    altura: 0,
    gramatura: 230,
    tipoOnda: 'E',
    quantidade: 0,
    custoFolha: 0,
    usoDestinado: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('ondulados');
    if (saved) {
      setOndulados(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ondulados', JSON.stringify(ondulados));
  }, [ondulados]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setOndulados(ondulados.map(o =>
        o.id === editingId ? { ...formData, id: editingId } : o
      ));
      setEditingId(null);
    } else {
      const novoOndulado: Ondulado = {
        ...formData,
        id: Date.now().toString()
      };
      setOndulados([...ondulados, novoOndulado]);
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      fornecedor: 'MICROPACK',
      largura: 0,
      altura: 0,
      gramatura: 230,
      tipoOnda: 'E',
      quantidade: 0,
      custoFolha: 0,
      usoDestinado: ''
    });
  };

  const handleEdit = (ondulado: Ondulado) => {
    setEditingId(ondulado.id);
    setFormData({
      nome: ondulado.nome,
      fornecedor: ondulado.fornecedor,
      largura: ondulado.largura,
      altura: ondulado.altura,
      gramatura: ondulado.gramatura,
      tipoOnda: ondulado.tipoOnda,
      quantidade: ondulado.quantidade,
      custoFolha: ondulado.custoFolha,
      usoDestinado: ondulado.usoDestinado
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este ondulado?')) {
      setOndulados(ondulados.filter(o => o.id !== id));
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Controle de Estoque - Ondulado</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            + Novo Ondulado
          </button>
        </div>

        {ondulados.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            Nenhum ondulado cadastrado. Clique em "Novo Ondulado" para começar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ondulados.map((ondulado) => (
              <div key={ondulado.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{ondulado.nome}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ondulado)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(ondulado.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Fornecedor:</span> {ondulado.fornecedor}</p>
                  <p><span className="font-semibold">Dimensões:</span> {ondulado.largura} x {ondulado.altura} mm</p>
                  <p><span className="font-semibold">Gramatura:</span> {ondulado.gramatura} g/m²</p>
                  <p><span className="font-semibold">Tipo da Onda:</span> {ondulado.tipoOnda}</p>
                  <p className="text-lg"><span className="font-semibold">Estoque:</span> <span className="text-blue-600 font-bold">{ondulado.quantidade}</span> folhas</p>
                  <p><span className="font-semibold">Custo/Folha:</span> R$ {ondulado.custoFolha.toFixed(2)}</p>
                  {ondulado.usoDestinado && (
                    <p><span className="font-semibold">Uso:</span> {ondulado.usoDestinado}</p>
                  )}
                  <p className="pt-2 border-t"><span className="font-semibold">Valor Total:</span> <span className="text-green-600 font-bold">R$ {(ondulado.quantidade * ondulado.custoFolha).toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {editingId ? 'Editar Ondulado' : 'Novo Ondulado no Estoque'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Nome/Descrição
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Ondulado E230"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Fornecedor
                    </label>
                    <select
                      value={formData.fornecedor}
                      onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>MICROPACK</option>
                      <option>OUTROS</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Largura (mm)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.largura}
                        onChange={(e) => setFormData({...formData, largura: Number(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Altura (mm)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.altura}
                        onChange={(e) => setFormData({...formData, altura: Number(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Gramatura (g/m²)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.gramatura}
                      onChange={(e) => setFormData({...formData, gramatura: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Tipo da Onda
                    </label>
                    <select
                      value={formData.tipoOnda}
                      onChange={(e) => setFormData({...formData, tipoOnda: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>E</option>
                      <option>B</option>
                      <option>C</option>
                      <option>BC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Quantidade em Estoque (folhas)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.quantidade}
                      onChange={(e) => setFormData({...formData, quantidade: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Custo por Folha (R$)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.custoFolha}
                      onChange={(e) => setFormData({...formData, custoFolha: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Uso Destinado
                    </label>
                    <textarea
                      value={formData.usoDestinado}
                      onChange={(e) => setFormData({...formData, usoDestinado: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Caixas de transporte, displays..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
