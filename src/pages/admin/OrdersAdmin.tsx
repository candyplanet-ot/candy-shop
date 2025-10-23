import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

type Order = {
  id: string;
  status: string;
  created_at: string;
  subtotal?: number;
  shipping_address?: {
    address1: string;
    address2?: string;
    city: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  items?: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders with customer details
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          subtotal,
          shipping_address
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              quantity,
              price,
              product_name,
              products (
                name
              )
            `)
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
            return { ...order, items: [] };
          }

          const items = (itemsData || []).map(item => ({
            product_name: item.product_name || (item.products as any)?.name || 'Produit Inconnu',
            quantity: item.quantity,
            price: item.price,
          }));

          return { ...order, items };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
      return;
    }

    try {
      // First delete order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) {
        console.error('Error deleting order items:', itemsError);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer les articles de la commande.",
          variant: "destructive",
        });
        return;
      }

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) {
        console.error('Error deleting order:', orderError);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la commande.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setOrders(orders.filter(order => order.id !== orderId));

      toast({
        title: "Succès",
        description: "Commande supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6">
        <h1 className="text-2xl font-baloo font-bold">Gérer les Commandes</h1>
        <Card>
          <CardContent className="p-4">
            {loading ? (
              <div>Chargement des commandes...</div>
            ) : orders.length === 0 ? (
              <div>Aucune commande trouvée.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold">ID Commande</h3>
                        <p className="text-sm text-gray-600">{order.id}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Client</h3>
                        <p className="text-sm">
                          {order.shipping_address?.address1 ? order.shipping_address.address1.split(' ')[0] + ' ' + (order.shipping_address.address1.split(' ')[1] || '') : 'Client Invité'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address?.phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Statut</h3>
                        <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Date</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Actions</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteOrder(order.id)}
                          className="text-xs"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    {order.shipping_address && (
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Adresse de Livraison</h3>
                        <div className="text-sm text-gray-700">
                          <p>{order.shipping_address.address1}</p>
                          {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                          <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                          <p>{order.shipping_address.country}</p>
                          {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-2">Articles Commandés</h3>
                      <div className="space-y-1">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                              <strong>{item.product_name}</strong> - Quantité: <span className="font-semibold text-blue-600">{item.quantity}</span> - Prix: €{(item.price / 100).toFixed(2)} chacun
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            Aucun article trouvé pour cette commande
                          </div>
                        )}
                      </div>
                      {order.subtotal && (
                        <div className="mt-2 font-semibold text-lg border-t pt-2">
                          Total : €{order.subtotal.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersAdmin;