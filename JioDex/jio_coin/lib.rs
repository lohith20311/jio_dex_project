#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod jio_coin {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct JioCoin {
        total_supply: u128,
        balances: Mapping<AccountId, u128>,
    }

    impl JioCoin {
        #[ink(constructor)]
        pub fn new(initial_supply: u128) -> Self {
            let caller = Self::env().caller();
            let mut balances = Mapping::new();
            balances.insert(caller, &initial_supply); // FIX: Removed unnecessary borrow
            
            Self {
                total_supply: initial_supply,
                balances,
            }
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> u128 {
            self.balances.get(owner).unwrap_or(0) // FIX: Removed unnecessary borrow
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, amount: u128) -> bool {
            let sender = Self::env().caller();
            let sender_balance = self.balances.get(sender).unwrap_or(0); // FIX: Removed unnecessary borrow

            // FIX: Use checked_sub to prevent underflow
            let new_sender_balance = sender_balance.checked_sub(amount);
            if new_sender_balance.is_none() {
                return false; // Sender does not have enough balance
            }

            let receiver_balance = self.balances.get(to).unwrap_or(0); // FIX: Removed unnecessary borrow

            // FIX: Use checked_add to prevent overflow
            let new_receiver_balance = receiver_balance.checked_add(amount);
            if new_receiver_balance.is_none() {
                return false; // Overflow detected
            }

            self.balances.insert(sender, &new_sender_balance.unwrap()); // FIX: Removed unnecessary borrow
            self.balances.insert(to, &new_receiver_balance.unwrap()); // FIX: Removed unnecessary borrow

            true
        }
    }
}
