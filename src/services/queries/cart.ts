import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/api';
import { CartGroup, CartItemNested, RestaurantDetail } from '@/types';
import { queryKeys } from './keys';

/**
 * --- Pure Helper Functions for Optimistic UI Logic ---
 */

const updateItemInList = (
  items: CartItemNested[],
  menuId: string,
  quantityChange: number
): CartItemNested[] => {
  return items.map((item) => {
    if (String(item.menu.id) !== menuId) return item;
    const newQuantity = item.quantity + quantityChange;
    return {
      ...item,
      quantity: newQuantity,
      itemTotal: newQuantity * item.menu.price,
    };
  });
};

const calculateSubtotal = (items: CartItemNested[]): number =>
  items.reduce((sum, i) => sum + i.itemTotal, 0);

const createOptimisticItem = (
  menuItem: { id: string; name: string; price: number; image: string },
  quantity: number
): CartItemNested => ({
  id: `temp-${Date.now()}`,
  menu: {
    id: menuItem.id,
    foodName: menuItem.name,
    price: menuItem.price,
    image: menuItem.image,
  },
  quantity: quantity,
  itemTotal: menuItem.price * quantity,
});

const getUpdatedCartOnAdd = (
  oldCart: CartGroup[],
  newItem: {
    restaurantId: string | number;
    menuId: string | number;
    quantity: number;
  },
  restaurantDetail?: RestaurantDetail
): CartGroup[] => {
  const restaurantId = String(newItem.restaurantId);
  const menuId = String(newItem.menuId);
  const newCart = [...oldCart];

  const groupIndex = newCart.findIndex(
    (g) => String(g.restaurant.id) === restaurantId
  );

  if (groupIndex > -1) {
    const group = newCart[groupIndex];
    if (!group) return oldCart;

    const hasItem = group.items.some((i) => String(i.menu.id) === menuId);

    if (hasItem) {
      const items = updateItemInList(group.items, menuId, newItem.quantity);
      newCart[groupIndex] = {
        ...group,
        items,
        subtotal: calculateSubtotal(items),
      };
    } else if (restaurantDetail) {
      const menuItem = restaurantDetail.menu.find(
        (m) => String(m.id) === menuId
      );
      if (menuItem) {
        const items = [
          ...group.items,
          createOptimisticItem(menuItem, newItem.quantity),
        ];
        newCart[groupIndex] = {
          ...group,
          items,
          subtotal: calculateSubtotal(items),
        };
      }
    }
  } else if (restaurantDetail) {
    const menuItem = restaurantDetail.menu.find((m) => String(m.id) === menuId);
    if (menuItem) {
      const items = [createOptimisticItem(menuItem, newItem.quantity)];
      newCart.push({
        restaurant: {
          id: restaurantDetail.id,
          name: restaurantDetail.name,
          logo: restaurantDetail.logo,
        },
        items,
        subtotal: calculateSubtotal(items),
      });
    }
  }
  return newCart;
};

const getUpdatedCartOnUpdate = (
  oldCart: CartGroup[],
  itemId: string | number,
  quantity: number
): CartGroup[] => {
  const itemIdStr = String(itemId);
  return oldCart.map((group) => {
    const hasItem = group.items.some((i) => String(i.id) === itemIdStr);
    if (!hasItem) return group;

    const items = group.items.map((item) => {
      if (String(item.id) !== itemIdStr) return item;
      return {
        ...item,
        quantity,
        itemTotal: quantity * item.menu.price,
      };
    });

    return {
      ...group,
      items,
      subtotal: calculateSubtotal(items),
    };
  });
};

const getUpdatedCartOnRemove = (
  oldCart: CartGroup[],
  itemId: string | number
): CartGroup[] => {
  const itemIdStr = String(itemId);
  return oldCart
    .map((group) => {
      const items = group.items.filter((i) => String(i.id) !== itemIdStr);
      return {
        ...group,
        items,
        subtotal: calculateSubtotal(items),
      };
    })
    .filter((group) => group.items.length > 0);
};

/**
 * --- Cart Hooks ---
 */

export const useCart = (isAuthenticated?: boolean) =>
  useQuery<CartGroup[]>({
    queryKey: queryKeys.cart.all,
    queryFn: cartService.getCart,
    enabled: !!isAuthenticated,
    staleTime: 1000 * 10, // 10 seconds to avoid excessive refetch during navigation
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.addToCart,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previousCart = queryClient.getQueryData<CartGroup[]>(
        queryKeys.cart.all
      );

      const restaurantId = String(newItem.restaurantId);
      const restaurantDetail = queryClient.getQueryData<RestaurantDetail>(
        queryKeys.restaurants.detail(restaurantId)
      );

      if (previousCart) {
        queryClient.setQueryData<CartGroup[]>(queryKeys.cart.all, (old) => {
          if (!old) return [];
          return getUpdatedCartOnAdd(old, newItem, restaurantDetail);
        });
      }

      return { previousCart };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string | number;
      quantity: number;
    }) => {
      if (String(itemId).startsWith('temp-')) return Promise.resolve();
      return cartService.updateQuantity(itemId, quantity);
    },
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previousCart = queryClient.getQueryData<CartGroup[]>(
        queryKeys.cart.all
      );

      if (previousCart) {
        queryClient.setQueryData<CartGroup[]>(queryKeys.cart.all, (old) => {
          if (!old) return [];
          return getUpdatedCartOnUpdate(old, itemId, quantity);
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string | number) => {
      if (String(itemId).startsWith('temp-')) return Promise.resolve();
      return cartService.removeFromCart(itemId);
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previousCart = queryClient.getQueryData<CartGroup[]>(
        queryKeys.cart.all
      );

      if (previousCart) {
        queryClient.setQueryData<CartGroup[]>(queryKeys.cart.all, (old) => {
          if (!old) return [];
          return getUpdatedCartOnRemove(old, itemId);
        });
      }

      return { previousCart };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};
