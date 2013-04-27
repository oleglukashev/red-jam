Order.class_eval do
  attr_accessible :bill_address_id, :ship_address_id
  before_validation :clone_shipping_address, :if => "Spree::Config[:disable_bill_address]"
  
  def clone_shipping_address
    if self.ship_address
      self.bill_address = self.ship_address
    end
    true  
  end
  
  def clone_billing_address
    if self.bill_address
      self.ship_address = self.bill_address
    end
    true
  end
  
  def bill_address_id=(id)
    address = Address.find(id)
    if address && address.user_id == self.user_id
      self["bill_address_id"] = address.id
      self.bill_address.reload
    else
      self["bill_address_id"] = nil
    end
  end
  
  def bill_address_attributes=(attributes)
    self.bill_address = update_or_create_address(attributes)
  end

  def ship_address_id=(id)
    address = Address.find(id)
    if address && address.user_id == self.user_id
      self["ship_address_id"] = address.id
      self.ship_address.reload
    else
      self["ship_address_id"] = nil
    end
  end
  
  def ship_address_attributes=(attributes)
    self.ship_address = update_or_create_address(attributes)
  end
  
  private
  
  def update_or_create_address(attributes)
    address = nil
    if attributes[:id]
      address = Address.find(attributes[:id])
      if address && address.editable?
        address.update_attributes(attributes)
      else
        attributes.delete(:id)
      end
    end
    
    if !attributes[:id]
      address = Address.new(attributes)
      address.save
    end
    
    address
  end

  def update_payment_state
    if payment_total < total
      self.payment_state = payment_total > 0 ? "balance_due" : "pending"
      self.payment_state = "failed" if payments.present? and payments.last.state == "failed"
    elsif payment_total > total
      self.payment_state = "credit_owed"
    else
      self.payment_state = "paid"
    end

    if old_payment_state = self.changed_attributes["payment_state"]
      self.state_events.create({
        :previous_state => old_payment_state,
        :next_state     => self.payment_state,
        :name           => "payment" ,
        :user_id        =>  (User.respond_to?(:current) && User.current && User.current.id) || self.user_id
      })
    end
  end
end
