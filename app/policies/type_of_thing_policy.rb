class TypeOfThingPolicy < ApplicationPolicy

  def index?
    @user
  end

  def show?
    @user
  end	

  def update?
    organizer?
  end

  def destroy?
    organizer_or_admin?
  end

  class Scope < Scope
    def user_roles
      
      joins_clause=["left join Roles r on r.mname='TypeOfThing'",
                    "r.mid=t.id",
                    "r.user_id #{user_criteria}"].join(" and ")
      scope.from('type_of_things t').select("t.*, r.role_name")
          .joins(joins_clause)
    end

    def resolve
      user_roles
    end
  end

end
