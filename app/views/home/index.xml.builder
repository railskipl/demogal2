xml.product_list do
  for p in @products
    xml.product do
      xml.title(p.title)
      xml.description(p.description)
      xml.price(p.price)
    end
  end
end
